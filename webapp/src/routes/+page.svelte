<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/stores';
	import DocDetail from '$lib/components/DocDetail.svelte';
	import DocList from '$lib/components/DocList.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import SearchPanel from '$lib/components/SearchPanel.svelte';
	import { API_BASE } from '$lib/config/api';
	import { formatNumber, locale, setLocale, t } from '$lib/i18n';
	import { trackEvent } from '$lib/analytics';
	import { theme, toggleTheme } from '$lib/stores/theme';
	import type { DocItem } from '$lib/types/docs';
	import type { PageData } from './$types';
	import { onDestroy, tick } from 'svelte';

	type ErrorKey = '' | 'list_failed' | 'detail_failed' | 'suggestion_failed';

	let { data } = $props<{ data: PageData }>();

	const query = $derived(data.query);
	const pageSize = $derived(Number.parseInt(query.size || '20', 10));
	const currentPage = $derived(Number.parseInt(query.page || '1', 10));
	const totalItems = $derived(data.docs?.total ?? 0);
	const totalPages = $derived(Math.max(1, Math.ceil(totalItems / pageSize)));
	const recentDocs = $derived(data.stats?.recent ?? []);

	const tagEntries = $derived(
		Object.entries(data.tags?.tags ?? {})
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)
	);
	const deptOptions = $derived(
		Array.from(new Set(data.docs?.items?.map((item) => item.dept).filter(Boolean) ?? [])).sort()
	);
	const roleOptions = $derived(
		Array.from(new Set(data.docs?.items?.map((item) => item.role).filter(Boolean) ?? [])).sort()
	);

	const isNavigating = $derived(Boolean($navigating));
	const navigatingToId = $derived($navigating?.to?.url?.searchParams.get('id') ?? '');
	const listLoading = $derived(isNavigating && !navigatingToId);
	const detailLoading = $derived(isNavigating && Boolean(navigatingToId));

	let suggestionTitles = $state<string[]>([]);
	let suggestionTags = $state<string[]>([]);
	let suggestionLoading = $state(false);
	let suggestionError = $state<ErrorKey>('');
	let suggestionTimer: ReturnType<typeof setTimeout> | null = null;

	let detailDialog: HTMLDivElement | null = null;

	onDestroy(() => {
		if (suggestionTimer) clearTimeout(suggestionTimer);
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
		trackEvent('search_submitted', {
			q: params.get('q') ?? '',
			dept: params.get('dept') ?? '',
			role: params.get('role') ?? '',
			type: params.get('type') ?? '',
			tags: params.get('tags') ?? ''
		});
	};

	const clearSearch = async () => {
		suggestionTitles = [];
		suggestionTags = [];
		suggestionError = '';
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
		trackEvent('doc_opened', { id: doc.id, title: doc.title });
		await tick();
		detailDialog?.focus();
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
			if (!response.ok) throw new Error('suggestion_failed');
			const payload = await response.json();
			suggestionTitles = payload?.titles ?? [];
			suggestionTags = payload?.tags ?? [];
		} catch {
			suggestionError = 'suggestion_failed';
		} finally {
			suggestionLoading = false;
		}
	};

	const scheduleSuggestions = (keyword: string) => {
		if (suggestionTimer) clearTimeout(suggestionTimer);
		suggestionTimer = setTimeout(() => {
			fetchSuggestions(keyword);
		}, 180);
	};

	const selectTitleSuggestion = async (value: string) => {
		const params = new URLSearchParams({
			q: value,
			page: '1',
			size: query.size || '20'
		});
		await goto(`/?${params.toString()}`);
	};

	const selectTagSuggestion = async (value: string) => {
		const params = new URLSearchParams({
			q: query.q,
			dept: query.dept,
			role: query.role,
			type: query.type,
			tags: value,
			sort: query.sort,
			page: '1',
			size: query.size || '20'
		});
		for (const [key, val] of params.entries()) {
			if (!val) params.delete(key);
		}
		await goto(`/?${params.toString()}`);
	};

	const retryLoad = async () => {
		if (typeof window === 'undefined') return;
		await invalidateAll();
	};

	const handleOverlayKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape') closeDetail();
	};

	const handleDialogKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			event.stopPropagation();
			closeDetail();
		}
	};
</script>

<svelte:head>
	<title>{$t('app.title')}</title>
	<meta name="description" content={$t('app.description')} />
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
>
	{$t('controls.skipToContent')}
</a>

<div class="min-h-screen flex flex-col">
	<header class="mx-auto w-full max-w-content px-4 sm:px-6 py-section">
		<div class="card grid gap-6 p-card">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface/70 text-accent"
						aria-hidden="true"
					>
						<svg viewBox="0 0 24 24" width="20" height="20" fill="none">
							<rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
							<path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.5" />
						</svg>
					</div>
					<div>
						<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
							{$t('brand.title')}
						</div>
						<div class="text-xs text-muted">{$t('brand.subtitle')}</div>
					</div>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<label class="grid gap-1 text-xs font-semibold text-muted">
						{$t('controls.language')}
						<select
							class="input-field min-w-[140px]"
							value={$locale}
							aria-label={$t('aria.languageSelect')}
							onchange={(event) =>
								setLocale((event.target as HTMLSelectElement).value as typeof $locale)}
						>
							<option value="zh-CN">{$t('locale.zh')}</option>
							<option value="en">{$t('locale.en')}</option>
						</select>
					</label>
					<button
						class="btn btn-ghost"
						type="button"
						onclick={toggleTheme}
						aria-label={$t('aria.themeToggle')}
					>
						<span class="text-xs font-semibold uppercase tracking-[0.2em]">
							{$t('controls.theme')}
						</span>
						<span class="text-sm">
							{$theme === 'dark' ? $t('controls.themeDark') : $t('controls.themeLight')}
						</span>
					</button>
				</div>
			</div>
			<div class="grid gap-2">
				<h1 class="m-0 text-3xl leading-tight sm:text-4xl lg:text-[44px]">
					{$t('hero.heading')}
				</h1>
				<p class="m-0 max-w-2xl text-sm text-muted">{$t('hero.subheading')}</p>
			</div>
			<SearchPanel
				query={query}
				tagEntries={tagEntries}
				suggestionTitles={suggestionTitles}
				suggestionTags={suggestionTags}
				suggestionLoading={suggestionLoading}
				suggestionError={suggestionError}
				deptOptions={deptOptions}
				roleOptions={roleOptions}
				isSearching={listLoading}
				onSubmit={submitSearch}
				onClear={clearSearch}
				onSuggest={scheduleSuggestions}
				onSelectTitle={selectTitleSuggestion}
				onSelectTag={selectTagSuggestion}
			/>
			{#if recentDocs.length}
				<div class="grid gap-2">
					<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
						{$t('status.recent')}
					</div>
					<div class="flex flex-wrap gap-2">
						{#each recentDocs.slice(0, 4) as item}
							<button
								class="chip"
								type="button"
								onclick={() => openDetail(item)}
								aria-label={$t('actions.view', { title: item.title })}
							>
								{item.title}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</header>

	<main class="flex-1" id="main-content">
		<section
			class="mx-auto w-full max-w-content px-4 pb-section sm:px-6"
			aria-labelledby="results-title"
		>
			<div class="flex flex-wrap items-end justify-between gap-4">
				<div class="grid gap-1">
					<h2 class="m-0 text-xl font-semibold text-ink" id="results-title">
						{$t('list.title')}
					</h2>
					<p class="m-0 text-sm text-muted">
						{$t('list.total', { count: formatNumber(totalItems, $locale) })}
					</p>
				</div>
				<div class="text-sm text-muted">
					{$t('status.results', { count: formatNumber(totalItems, $locale) })}
				</div>
			</div>
			<DocList
				items={data.docs?.items ?? []}
				error={data.listError}
				isLoading={listLoading}
				onSelect={openDetail}
				onRetry={retryLoad}
			/>
			<div class="mt-6">
				<PaginationControls
					currentPage={currentPage}
					totalPages={totalPages}
					totalItems={totalItems}
					isLoading={listLoading}
					onPrev={() => goToPage(currentPage - 1)}
					onNext={() => goToPage(currentPage + 1)}
				/>
			</div>
		</section>
	</main>
</div>

{#if query.id}
	<div class="overlay" role="presentation" tabindex="-1" onclick={closeDetail} onkeydown={handleOverlayKey}>
		<div
			class="modal grid gap-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="detail-dialog-title"
			tabindex="-1"
			bind:this={detailDialog}
			data-testid="detail-dialog"
			onclick={(event) => event.stopPropagation()}
			onkeydown={handleDialogKey}
		>
			<div class="flex items-center justify-between gap-3">
				<div class="text-base font-semibold text-ink" id="detail-dialog-title">
					{$t('detail.title')}
				</div>
				<button class="btn btn-ghost" type="button" onclick={closeDetail}>
					{$t('actions.close')}
				</button>
			</div>
			<DocDetail
				doc={data.detail}
				html={data.detailHtml}
				toc={data.toc}
				related={data.related}
				isLoading={detailLoading}
				error={data.detailError}
				onRetry={retryLoad}
				onSelectRelated={openDetail}
			/>
		</div>
	</div>
{/if}
