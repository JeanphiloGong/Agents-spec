<script lang="ts">
	import { goto } from '$app/navigation';
	import DocDetail from '$lib/components/DocDetail.svelte';
	import DocList from '$lib/components/DocList.svelte';

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

	type LoadData = {
		docs: DocsResponse;
		tags: TagsResponse;
		stats: StatsResponse;
		detail: DocItem | null;
		detailHtml: string;
		toc: { level: number; text: string }[];
		related: DocItem[];
		error: string;
		query: {
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
	};

	let { data } = $props<{ data: LoadData }>();

	const query = $derived(data.query);
	const tagEntries = $derived(Object.entries(data.tags?.tags ?? {}).slice(0, 10));
	const pageSize = $derived(Number.parseInt(query.size || '20', 10));
	const currentPage = $derived(Number.parseInt(query.page || '1', 10));
	const totalPages = $derived(Math.max(1, Math.ceil((data.docs?.total ?? 0) / pageSize)));

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
			const response = await fetch(`http://localhost:7070/api/suggestions?q=${trimmed}`);
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

<div class="page">
	<header class="shell section fade-in">
		<div class="glass-card" style="padding:24px;display:grid;gap:18px;">
			<div style="display:flex;align-items:center;gap:12px;">
				<div
					style="width:40px;height:40px;border-radius:12px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;"
					aria-hidden="true"
				>
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none">
						<rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
						<path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.5" />
					</svg>
				</div>
				<div>
					<div style="font-weight:700;letter-spacing:0.04em;">AGENTS</div>
					<div style="font-size:12px;color:var(--muted);">AGENTS Library · Search · Download</div>
				</div>
			</div>
			<h1 style="font-size:clamp(30px,3.2vw,44px);margin:0;">
				AGENTS 项目文档中心
			</h1>
			<div style="display:flex;gap:12px;flex-wrap:wrap;">
				<button class="button primary" type="button" onclick={() => (paletteOpen = true)}>
					搜索
				</button>
			</div>
		</div>
	</header>

	<main>
		<section id="list" class="section">
			<div class="shell">
				<DocList
					items={data.docs?.items ?? []}
					error={data.error}
					isLoading={!data.docs?.items?.length && !data.error}
					onSelect={openDetail}
				/>
				<div
					style="margin-top:20px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;"
				>
					<button
						class="button ghost"
						type="button"
						disabled={currentPage <= 1}
						onclick={() => goToPage(currentPage - 1)}
					>
						上一页
					</button>
					<span style="color:var(--muted);">
						第 {currentPage} / {totalPages} 页 · 共 {data.docs?.total ?? 0} 条
					</span>
					<button
						class="button ghost"
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
			class="modal"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<div class="modal-header">
				<div class="modal-title">搜索 AGENTS.md</div>
				<button class="button ghost" type="button" onclick={closePalette}>关闭</button>
			</div>
			<form style="display:grid;gap:12px;" onsubmit={submitSearch}>
				<input
					id="search-input"
					name="q"
					type="text"
					value={query.q}
					placeholder="输入关键词..."
					class="input-dark"
					oninput={(event) => fetchSuggestions((event.target as HTMLInputElement).value)}
				/>
				<div style="display:flex;gap:12px;flex-wrap:wrap;">
					<button class="button primary" type="submit">搜索</button>
					<button class="button ghost" type="button" onclick={clearSearch}>
						清空
					</button>
				</div>
				{#if suggestionLoading}
					<div style="color:var(--muted);">加载建议中...</div>
				{:else if suggestionError}
					<div style="color:#9b2c2c;">{suggestionError}</div>
				{:else if suggestionTitles.length || suggestionTags.length}
					<div style="display:grid;gap:12px;">
						{#if suggestionTitles.length}
							<div>
								<div style="font-size:12px;color:var(--muted);margin-bottom:6px;">标题</div>
								<div class="suggestion-list">
									{#each suggestionTitles as title}
										<button
											class="suggestion-item"
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
								<div style="font-size:12px;color:var(--muted);margin-bottom:6px;">标签</div>
								<div style="display:flex;gap:8px;flex-wrap:wrap;">
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
			class="modal"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<div class="modal-header">
				<div class="modal-title">文档详情</div>
				<button class="button ghost" type="button" onclick={closeDetail}>关闭</button>
			</div>
			<DocDetail
				doc={data.detail}
				html={data.detailHtml}
				toc={data.toc}
				related={data.related}
				isLoading={!data.detail}
			/>
		</div>
	</div>
{/if}
