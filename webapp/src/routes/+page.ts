import type { PageLoad } from './$types';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

const API_BASE = 'http://localhost:7070/api';

const toQuery = (url: URL) => {
	const params = new URLSearchParams();
	const q = url.searchParams.get('q');
	const dept = url.searchParams.get('dept');
	const role = url.searchParams.get('role');
	const type = url.searchParams.get('type');
	const tags = url.searchParams.get('tags');
	const sort = url.searchParams.get('sort');
	const page = url.searchParams.get('page');
	const size = url.searchParams.get('size');
	const id = url.searchParams.get('id');

	if (q) params.set('q', q);
	if (dept) params.set('dept', dept);
	if (role) params.set('role', role);
	if (type) params.set('type', type);
	if (tags) params.set('tags', tags);
	if (sort) params.set('sort', sort);
	if (id) params.set('id', id);

	params.set('page', page ?? '1');
	params.set('size', size ?? '20');
	return params.toString();
};

export const load: PageLoad = async ({ fetch, url }) => {
	const query = toQuery(url);
	try {
		const [docsRes, tagsRes, statsRes, detailRes] = await Promise.all([
			fetch(`${API_BASE}/docs?${query}`),
			fetch(`${API_BASE}/tags`),
			fetch(`${API_BASE}/stats`),
			url.searchParams.get('id')
				? fetch(`${API_BASE}/docs/${url.searchParams.get('id')}`)
				: Promise.resolve(null)
		]);

		if (!docsRes.ok) {
			throw new Error('Failed to load docs');
		}

		const docs = await docsRes.json();
		const tags = tagsRes.ok ? await tagsRes.json() : { tags: {} };
		const stats = statsRes.ok ? await statsRes.json() : { total: 0, recent: [] };
		const detailPayload = detailRes && detailRes.ok ? await detailRes.json() : null;
		const detailContent = detailPayload?.doc?.content ?? '';
		const detailHtml = detailContent ? DOMPurify.sanitize(marked.parse(detailContent)) : '';

		return {
			docs,
			tags,
			stats,
			detail: detailPayload?.doc ?? null,
			detailHtml,
			error: '',
			query: {
				q: url.searchParams.get('q') ?? '',
				dept: url.searchParams.get('dept') ?? '',
				role: url.searchParams.get('role') ?? '',
				type: url.searchParams.get('type') ?? '',
				tags: url.searchParams.get('tags') ?? '',
				sort: url.searchParams.get('sort') ?? 'updated',
				page: url.searchParams.get('page') ?? '1',
				size: url.searchParams.get('size') ?? '20',
				id: url.searchParams.get('id') ?? ''
			}
		};
	} catch (error) {
		return {
			docs: { total: 0, items: [] },
			tags: { tags: {} },
			stats: { total: 0, recent: [] },
			detail: null,
			detailHtml: '',
			error: error instanceof Error ? error.message : 'Failed to load docs',
			query: {
				q: url.searchParams.get('q') ?? '',
				dept: url.searchParams.get('dept') ?? '',
				role: url.searchParams.get('role') ?? '',
				type: url.searchParams.get('type') ?? '',
				tags: url.searchParams.get('tags') ?? '',
				sort: url.searchParams.get('sort') ?? 'updated',
				page: url.searchParams.get('page') ?? '1',
				size: url.searchParams.get('size') ?? '20',
				id: url.searchParams.get('id') ?? ''
			}
		};
	}
};
