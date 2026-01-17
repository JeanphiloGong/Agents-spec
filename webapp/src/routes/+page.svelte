<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DocDetail from '$lib/components/DocDetail.svelte';
	import DocList from '$lib/components/DocList.svelte';
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	const API_BASE = 'http://localhost:7070/api';

	type DocItem = {
		id: string;
		title: string;
		path: string;
		dept: string;
		role: string;
		type: string;
		tags: string[];
		updated_at: string;
		excerpt: string;
		content?: string;
	};

	type RawDoc = Partial<DocItem> & {
		ID?: string;
		Title?: string;
		Path?: string;
		Dept?: string;
		Role?: string;
		Type?: string;
		Tags?: string[];
		UpdatedAt?: string;
		Excerpt?: string;
		Content?: string;
	};

	type DocsResponse = {
		total: number;
		items: DocItem[];
	};

	type TagsResponse = {
		tags: Record<string, number>;
	};

	type StatsResponse = {
		total: number;
		recent: DocItem[];
	};

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

	type LoadData = {
		docs: DocsResponse;
		tags: TagsResponse;
		stats: StatsResponse;
		detail: DocItem | null;
		detailHtml: string;
		toc: { level: number; text: string }[];
		related: DocItem[];
		error: string;
		query: QueryState;
	};

	const normalizeDoc = (raw: RawDoc | null): DocItem | null => {
		if (!raw) return null;
		return {
			id: raw.id ?? raw.ID ?? '',
			title: raw.title ?? raw.Title ?? '',
			path: raw.path ?? raw.Path ?? '',
			dept: raw.dept ?? raw.Dept ?? '',
			role: raw.role ?? raw.Role ?? '',
			type: raw.type ?? raw.Type ?? '',
			tags: raw.tags ?? raw.Tags ?? [],
			updated_at: raw.updated_at ?? raw.UpdatedAt ?? '',
			excerpt: raw.excerpt ?? raw.Excerpt ?? '',
			content: raw.content ?? raw.Content ?? ''
		};
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

	let data = $state<LoadData>({
		docs: { total: 0, items: [] },
		tags: { tags: {} },
		stats: { total: 0, recent: [] },
		detail: null,
		detailHtml: '',
		toc: [],
		related: [],
		error: '',
		query: {
			q: '',
			dept: '',
			role: '',
			type: '',
			tags: '',
			sort: 'updated',
			page: '1',
			size: '20',
			id: ''
		}
	});

	let listLoading = $state(false);
	let detailLoading = $state(false);

	const query = $derived(data.query);
	const tagEntries = $derived(Object.entries(data.tags?.tags ?? {}).slice(0, 10));
	const pageSize = $derived(Number.parseInt(query.size || '20', 10));
	const currentPage = $derived(Number.parseInt(query.page || '1', 10));
	const totalPages = $derived(Math.max(1, Math.ceil((data.docs?.total ?? 0) / pageSize)));

	const loadFromUrl = async (url: URL) => {
		const nextQuery = buildQueryState(url);
		listLoading = true;
		detailLoading = Boolean(nextQuery.id);
		data.error = '';

		try {
			const queryString = buildQueryString(nextQuery);
			const [docsRes, tagsRes, statsRes] = await Promise.all([
				fetch(`${API_BASE}/docs?${queryString}`),
				fetch(`${API_BASE}/tags`),
				fetch(`${API_BASE}/stats`)
			]);

			if (!docsRes.ok) throw new Error('Failed to load docs');

			const docs = await docsRes.json();
			const tags = tagsRes.ok ? await tagsRes.json() : { tags: {} };
			const stats = statsRes.ok ? await statsRes.json() : { total: 0, recent: [] };

			let detail: DocItem | null = null;
			let detailHtml = '';
			let toc: { level: number; text: string }[] = [];
			let related: DocItem[] = [];

			if (nextQuery.id) {
				const [detailRes, relatedRes] = await Promise.all([
					fetch(`${API_BASE}/docs/${nextQuery.id}`),
					fetch(`${API_BASE}/related?id=${nextQuery.id}`)
				]);
				const detailPayload = detailRes.ok ? await detailRes.json() : null;
				const relatedPayload = relatedRes.ok ? await relatedRes.json() : { items: [] };
				detail = normalizeDoc(detailPayload?.doc ?? null);
				toc = detailPayload?.toc ?? [];
				related = relatedPayload?.items ?? [];
				const content = detail?.content ?? '';
				detailHtml = content ? DOMPurify.sanitize(marked.parse(content)) : '';
			}

			data = {
				docs,
				tags,
				stats,
				detail,
				detailHtml,
				toc,
				related,
				error: '',
				query: nextQuery
			};
		} catch (error) {
			data = {
				...data,
				docs: { total: 0, items: [] },
				tags: { tags: {} },
				stats: { total: 0, recent: [] },
				detail: null,
				detailHtml: '',
				toc: [],
				related: [],
				error: error instanceof Error ? error.message : 'Failed to load docs',
				query: nextQuery
			};
		} finally {
			listLoading = false;
			detailLoading = false;
		}
	};

	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			loadFromUrl($page.url);
		});
		return unsubscribe;
	});

	const submitSearch = async (event: SubmitEvent) => {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const params = new URLSearchParams();

		for (const [key, value] of formData.entries()) {
			const text = String(value).trim();
			if (text) params.set(key, text);
		}

		if (!params.get('sort')) params.set('sort', 'updated');
		if (!params.get('size')) params.set('size', query.size || '20');
		params.set('page', '1');

		await goto(`/?${params.toString()}`);
	};

	const clearSearch = async () => {
		await goto('/');
	};

	const openDetail = async (doc: DocItem) => {
		const params = new URLSearchParams({
			q: query.q,
			dept: query.dept,
			role: query.role,
			type: query.type,
			tags: query.tags,
			sort: query.sort,
			page: query.page,
			size: query.size,
			id: doc.id
		});
		for (const [key, value] of params.entries()) {
			if (!value) params.delete(key);
		}
		await goto(`/?${params.toString()}`);
	};

	const goToPage = async (pageNumber: number) => {
		const params = new URLSearchParams({
			q: query.q,
			dept: query.dept,
			role: query.role,
			type: query.type,
			tags: query.tags,
			sort: query.sort,
			page: String(pageNumber),
			size: query.size,
			id: query.id
		});
		for (const [key, value] of params.entries()) {
			if (!value) params.delete(key);
		}
		await goto(`/?${params.toString()}`);
	};

	let paletteOpen = $state(false);
	let suggestionTitles = $state<string[]>([]);
	let suggestionTags = $state<string[]>([]);
	let suggestionLoading = $state(false);
	let suggestionError = $state('');

	const fetchSuggestions = async (keyword: string) => {
		const trimmed = keyword.trim();
		if (!trimmed) {
			suggestionTitles = [];
			suggestionTags = [];
			suggestionError = '';
			return;
		}
		suggestionLoading = true;
		suggestionError = '';
		try {
			const response = await fetch(`${API_BASE}/suggestions?q=${trimmed}`);
			if (!response.ok) throw new Error('Failed to load suggestions');
			const payload = await response.json();
			suggestionTitles = payload?.titles ?? [];
			suggestionTags = payload?.tags ?? [];
		} catch (error) {
			suggestionError = error instanceof Error ? error.message : 'Failed to load suggestions';
		} finally {
			suggestionLoading = false;
		}
	};
	const closePalette = () => {
		paletteOpen = false;
	};

	const closeDetail = async () => {
		const params = new URLSearchParams({
			q: query.q,
			dept: query.dept,
			role: query.role,
			type: query.type,
			tags: query.tags,
			sort: query.sort,
			page: query.page,
			size: query.size
		});
		for (const [key, value] of params.entries()) {
			if (!value) params.delete(key);
		}
		await goto(`/?${params.toString()}`);
	};

	const selectSuggestion = async (value: string) => {
		const params = new URLSearchParams({
			q: value,
			page: '1',
			size: query.size || '20'
		});
		await goto(`/?${params.toString()}`);
		paletteOpen = false;
	};
</script>

<svelte:head>
	<title>AGENTS · Library</title>
	<meta
		name="description"
		content="统一索引、搜索、筛选、下载 AGENTS.md，面向多智能体协作的文档枢纽。"
	/>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 fade-in">
		<div class="card grid gap-5 p-6">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-orange-600"
					aria-hidden="true"
				>
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none">
						<rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
						<path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.5" />
					</svg>
				</div>
				<div>
					<div class="text-xs font-semibold tracking-[0.2em] text-slate-500">AGENTS</div>
					<div class="text-xs text-slate-500">AGENTS Library · Search · Download</div>
				</div>
			</div>
			<h1 class="m-0 text-3xl leading-tight sm:text-4xl lg:text-[44px]">
				AGENTS 项目文档中心
			</h1>
			<div class="flex flex-wrap gap-3">
				<button class="btn btn-primary" type="button" onclick={() => (paletteOpen = true)}>
					搜索
				</button>
			</div>
		</div>
	</header>

	<main class="flex-1">
		<section id="list" class="py-6 sm:py-10">
			<div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
				<DocList
					items={data.docs?.items ?? []}
					error={data.error}
					isLoading={listLoading}
					onSelect={openDetail}
				/>
				<div class="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
					<button
						class="btn btn-ghost"
						type="button"
						disabled={currentPage <= 1}
						onclick={() => goToPage(currentPage - 1)}
					>
						上一页
					</button>
					<span class="text-sm text-slate-500">
						第 {currentPage} / {totalPages} 页 · 共 {data.docs?.total ?? 0} 条
					</span>
					<button
						class="btn btn-ghost"
						type="button"
						disabled={currentPage >= totalPages}
						onclick={() => goToPage(currentPage + 1)}
					>
						下一页
					</button>
				</div>
			</div>
		</section>

	</main>
</div>

{#if paletteOpen}
	<div class="overlay" role="button" tabindex="0" onclick={closePalette} onkeydown={closePalette}>
		<div
			class="modal grid gap-4"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<div class="flex items-center justify-between gap-3">
				<div class="text-base font-semibold text-slate-900">搜索 AGENTS.md</div>
				<button class="btn btn-ghost" type="button" onclick={closePalette}>关闭</button>
			</div>
			<form class="grid gap-3" onsubmit={submitSearch}>
				<input
					id="search-input"
					name="q"
					type="text"
					value={query.q}
					placeholder="输入关键词..."
					class="input-field"
					oninput={(event) => fetchSuggestions((event.target as HTMLInputElement).value)}
				/>
				<div class="flex flex-wrap gap-3">
					<button class="btn btn-primary" type="submit">搜索</button>
					<button class="btn btn-ghost" type="button" onclick={clearSearch}>
						清空
					</button>
				</div>
				{#if suggestionLoading}
					<div class="text-sm text-slate-500">加载建议中...</div>
				{:else if suggestionError}
					<div class="text-sm text-red-700">{suggestionError}</div>
				{:else if suggestionTitles.length || suggestionTags.length}
					<div class="grid gap-3">
						{#if suggestionTitles.length}
							<div>
								<div class="text-xs uppercase tracking-[0.2em] text-slate-500">标题</div>
								<div class="mt-2 grid max-h-52 gap-2 overflow-auto pr-1">
									{#each suggestionTitles as title}
										<button
											class="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-left text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-black/30"
											type="button"
											onclick={() => selectSuggestion(title)}
										>
											{title}
										</button>
									{/each}
								</div>
							</div>
						{/if}
						{#if suggestionTags.length}
							<div>
								<div class="text-xs uppercase tracking-[0.2em] text-slate-500">标签</div>
								<div class="mt-2 flex flex-wrap gap-2">
									{#each suggestionTags as tag}
										<button
											class="chip"
											type="button"
											onclick={() => selectSuggestion(tag)}
										>
											{tag}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</form>
		</div>
	</div>
{/if}

{#if query.id}
	<div class="overlay" role="button" tabindex="0" onclick={closeDetail} onkeydown={closeDetail}>
		<div
			class="modal grid gap-4"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<div class="flex items-center justify-between gap-3">
				<div class="text-base font-semibold text-slate-900">文档详情</div>
				<button class="btn btn-ghost" type="button" onclick={closeDetail}>关闭</button>
			</div>
			<DocDetail
				doc={data.detail}
				html={data.detailHtml}
				toc={data.toc}
				related={data.related}
				isLoading={detailLoading}
			/>
		</div>
	</div>
{/if}
