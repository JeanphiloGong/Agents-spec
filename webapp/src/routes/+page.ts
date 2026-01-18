import type { PageLoad } from './$types';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import { API_BASE } from '$lib/config/api';
import type { DocItem, RawDoc } from '$lib/types/docs';

type QueryState = {
	q: string;
	dept: string;
	role: string;
	type: string;
	tags: string;
	sort: string;
	page: string;
	size: string;
	id: string;
};

type TocItem = { level: number; text: string; id: string };

type HeadingToken = { type: 'heading'; depth: number; text: string };

type ListResponse = {
	total: number;
	items: DocItem[];
};

type TagResponse = {
	tags: Record<string, number>;
};

type StatsResponse = {
	total: number;
	recent: DocItem[];
};

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.trim()
		.replace(/\s+/g, '-');

const renderer = new marked.Renderer();
renderer.heading = (text, level) => {
	const slug = slugify(text);
	return `<h${level} id="${slug}">${text}</h${level}>`;
};
marked.use({ renderer, mangle: false, headerIds: false });

const stringValue = (value: unknown) => (typeof value === 'string' ? value : '');
const arrayValue = (value: unknown) =>
	Array.isArray(value)
		? value.filter((item): item is string => typeof item === 'string')
		: [];
const numberValue = (value: unknown) => {
	const num = Number(value);
	return Number.isFinite(num) ? num : 0;
};

const safeSanitize = (value: string) => {
	if (!value) return '';
	try {
		return DOMPurify.sanitize(value);
	} catch {
		return '';
	}
};

const sanitizeSnippet = (value: string) => safeSanitize(value);

const safeRenderMarkdown = (content: string) => {
	if (!content) return '';
	try {
		return safeSanitize(marked.parse(content));
	} catch {
		return '';
	}
};

const normalizeDoc = (raw: RawDoc | null): DocItem | null => {
	if (!raw) return null;

	const id = stringValue(raw.id ?? raw.ID).trim();
	const title = stringValue(raw.title ?? raw.Title).trim();
	const path = stringValue(raw.path ?? raw.Path).trim();
	const dept = stringValue(raw.dept ?? raw.Dept).trim();
	const role = stringValue(raw.role ?? raw.Role).trim();
	const type = stringValue(raw.type ?? raw.Type).trim().toLowerCase();
	const tags = arrayValue(raw.tags ?? raw.Tags);
	const updated_at = stringValue(raw.updated_at ?? raw.UpdatedAt).trim();
	const excerpt = sanitizeSnippet(stringValue(raw.excerpt ?? raw.Excerpt));
	const content = stringValue(raw.content ?? raw.Content);

	if (!id && !title) return null;

	return {
		id,
		title,
		path,
		dept,
		role,
		type,
		tags,
		updated_at,
		excerpt,
		content
	};
};

const normalizeDocs = (items: RawDoc[] = []) =>
	items.map((item) => normalizeDoc(item)).filter((item): item is DocItem => Boolean(item));

const buildTocItems = (items: { level: number; text: string }[]): TocItem[] =>
	items.map((item) => ({ ...item, id: slugify(item.text) }));

const buildTocFromMarkdown = (content: string): TocItem[] => {
	const tokens = marked.lexer(content);
	const headings = tokens.filter((token): token is HeadingToken => token.type === 'heading');
	return headings.map((heading) => ({
		level: heading.depth,
		text: heading.text,
		id: slugify(heading.text)
	}));
};

const resolveToc = (content: string, provided?: { level: number; text: string }[]): TocItem[] => {
	if (provided && provided.length) return buildTocItems(provided);
	if (!content) return [];
	return buildTocFromMarkdown(content);
};

const buildQueryState = (url: URL): QueryState => ({
	q: url.searchParams.get('q') ?? '',
	dept: url.searchParams.get('dept') ?? '',
	role: url.searchParams.get('role') ?? '',
	type: url.searchParams.get('type') ?? '',
	tags: url.searchParams.get('tags') ?? '',
	sort: url.searchParams.get('sort') ?? 'updated',
	page: url.searchParams.get('page') ?? '1',
	size: url.searchParams.get('size') ?? '20',
	id: url.searchParams.get('id') ?? ''
});

const buildQueryString = (query: QueryState) => {
	const params = new URLSearchParams();
	if (query.q) params.set('q', query.q);
	if (query.dept) params.set('dept', query.dept);
	if (query.role) params.set('role', query.role);
	if (query.type) params.set('type', query.type);
	if (query.tags) params.set('tags', query.tags);
	if (query.sort) params.set('sort', query.sort);
	params.set('page', query.page || '1');
	params.set('size', query.size || '20');
	return params.toString();
};

export const load: PageLoad = async ({ url, fetch }) => {
	const query = buildQueryState(url);
	const queryString = buildQueryString(query);

	let listError: '' | 'list_failed' = '';
	let detailError: '' | 'detail_failed' = '';

	let docs: ListResponse = { total: 0, items: [] };
	let tags: TagResponse = { tags: {} };
	let stats: StatsResponse = { total: 0, recent: [] };
	let detail: DocItem | null = null;
	let detailHtml = '';
	let toc: TocItem[] = [];
	let related: DocItem[] = [];

	try {
		const [docsRes, tagsRes, statsRes] = await Promise.all([
			fetch(`${API_BASE}/docs?${queryString}`),
			fetch(`${API_BASE}/tags`),
			fetch(`${API_BASE}/stats`)
		]);

		if (docsRes.ok) {
			const payload = await docsRes.json();
			docs = {
				total: numberValue(payload?.total),
				items: normalizeDocs(payload?.items ?? [])
			};
		} else {
			listError = 'list_failed';
		}

		if (tagsRes.ok) {
			const payload = await tagsRes.json();
			tags = { tags: payload?.tags ?? {} };
		}

		if (statsRes.ok) {
			const payload = await statsRes.json();
			stats = {
				total: numberValue(payload?.total),
				recent: normalizeDocs(payload?.recent ?? [])
			};
		}
	} catch {
		listError = 'list_failed';
	}

	if (query.id) {
		try {
			const encodedId = encodeURIComponent(query.id);
			const [detailRes, relatedRes] = await Promise.all([
				fetch(`${API_BASE}/docs/${encodedId}`),
				fetch(`${API_BASE}/related?id=${encodedId}`)
			]);

			if (detailRes.ok) {
				const payload = await detailRes.json();
				const rawDoc = payload?.doc ?? payload?.Doc ?? payload;
				const payloadContent = stringValue(payload?.content ?? payload?.Content);
				const mergedDoc = {
					...(rawDoc ?? {}),
					content: payloadContent || rawDoc?.content || rawDoc?.Content || ''
				};
				detail = normalizeDoc(mergedDoc);

				const markdown = detail?.content ?? '';
				detailHtml = safeRenderMarkdown(markdown);

				const providedToc = payload?.toc ?? payload?.Toc;
				toc = resolveToc(markdown, providedToc);
			} else {
				detailError = 'detail_failed';
			}

			if (relatedRes.ok) {
				const relatedPayload = await relatedRes.json();
				related = normalizeDocs(relatedPayload?.items ?? []);
			}
		} catch {
			detailError = 'detail_failed';
		}
	}

	return {
		docs,
		tags,
		stats,
		detail,
		detailHtml,
		toc,
		related,
		listError,
		detailError,
		query
	};
};
