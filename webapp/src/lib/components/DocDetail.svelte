<script lang="ts">
	import { API_BASE } from '$lib/config/api';
	import { formatDateTime, locale, t } from '$lib/i18n';
	import { trackEvent } from '$lib/analytics';
	import type { DocItem } from '$lib/types/docs';
	import { onDestroy } from 'svelte';

	type TocItem = { level: number; text: string; id: string };
	type Props = {
		doc: DocItem | null;
		html: string;
		toc: TocItem[];
		related: DocItem[];
		isLoading: boolean;
		error: string;
		onRetry: () => void;
		onSelectRelated: (doc: DocItem) => void;
	};

	let { doc, html, toc, related, isLoading, error, onRetry, onSelectRelated } = $props<Props>();

	let copyStatus = $state('');
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;

	const typeLabels: Record<string, string> = $derived({
		spec: $t('filters.typeSpec'),
		template: $t('filters.typeTemplate'),
		tutorial: $t('filters.typeTutorial')
	});

	const resetCopyStatus = () => {
		copyStatus = '';
		if (copyTimeout) {
			clearTimeout(copyTimeout);
			copyTimeout = null;
		}
	};

	const setCopyStatus = (status: string) => {
		copyStatus = status;
		if (copyTimeout) clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => {
			copyStatus = '';
			copyTimeout = null;
		}, 2200);
	};

	const handleCopy = async (kind: 'link' | 'content', text: string) => {
		resetCopyStatus();
		if (!text) return;
		try {
			if (!navigator.clipboard?.writeText) {
				setCopyStatus('error');
				return;
			}
			await navigator.clipboard.writeText(text);
			setCopyStatus(kind);
		} catch {
			setCopyStatus('error');
		}
	};

	onDestroy(() => {
		if (copyTimeout) clearTimeout(copyTimeout);
	});
</script>

<div class="grid gap-5 lg:grid-cols-3" aria-live="polite" aria-busy={isLoading}>
	<div class="card min-h-[300px] p-6 lg:col-span-2" aria-label={$t('aria.detailRegion')}>
		{#if error}
			<div class="grid gap-3" role="alert">
				<div class="flex items-center gap-2 text-sm font-semibold text-danger">
					<span aria-hidden="true">!</span>
					<span>{$t('states.errorDetail')}</span>
				</div>
				<button class="btn btn-ghost w-fit" type="button" onclick={onRetry}>
					{$t('actions.retry')}
				</button>
			</div>
		{:else if isLoading}
			<div class="grid gap-3" aria-hidden="true">
				<div class="skeleton-line h-5 w-1/2"></div>
				<div class="skeleton-line h-3"></div>
				<div class="skeleton-line h-3 w-4/5"></div>
			</div>
			<div class="sr-only" role="status">{$t('states.loadingDetail')}</div>
		{:else if doc}
			<h2 class="mb-3 mt-0 text-2xl font-semibold text-ink">{doc.title}</h2>
			{#if html}
				<article
					class="prose prose-sm sm:prose-base max-w-prose text-ink/80 prose-headings:font-display prose-headings:text-ink prose-a:text-accent prose-a:no-underline prose-code:rounded prose-code:bg-accent-soft/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:bg-accent-soft/10"
				>
					{@html html}
				</article>
			{:else}
				<p class="m-0 text-sm text-muted">{$t('states.emptyContent')}</p>
			{/if}
		{:else}
			<h2 class="mb-3 mt-0 text-2xl font-semibold text-ink">{$t('detail.title')}</h2>
			<p class="m-0 text-sm text-muted">{$t('states.emptyDetail')}</p>
		{/if}
	</div>
	<aside class="card grid gap-4 p-5 lg:col-span-1" aria-label={$t('detail.title')}>
		{#if isLoading}
			<div class="grid gap-2" aria-hidden="true">
				<div class="skeleton-line h-3 w-2/5"></div>
				<div class="skeleton-line h-3 w-3/5"></div>
				<div class="skeleton-line h-3 w-1/2"></div>
			</div>
		{:else if doc}
			{#if toc?.length}
				<nav class="grid gap-2" aria-label={$t('detail.toc')}>
					<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
						{$t('detail.toc')}
					</div>
					<div class="space-y-1 text-xs text-muted">
						{#each toc as item}
							<a class="block transition hover:text-ink" href={`#${item.id}`}>
								{'·'.repeat(Math.max(0, item.level - 1))} {item.text}
							</a>
						{/each}
					</div>
				</nav>
			{/if}
			<div>
				<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
					{$t('detail.department')}
				</div>
				<div class="text-sm font-semibold text-ink">{doc.dept}</div>
			</div>
			<div>
				<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
					{$t('detail.role')}
				</div>
				<div class="text-sm font-semibold text-ink">{doc.role}</div>
			</div>
			<div>
				<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
					{$t('detail.path')}
				</div>
				<div class="text-xs text-muted break-words">{doc.path}</div>
			</div>
			<div>
				<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
					{$t('detail.updated')}
				</div>
				{#if doc.updated_at}
					<div class="text-sm font-semibold text-ink">
						{formatDateTime(doc.updated_at, $locale)}
					</div>
				{:else}
					<div class="text-sm text-muted">-</div>
				{/if}
			</div>
			<div class="flex flex-wrap gap-2">
				{#if doc.type}
					<span class="tag">{typeLabels[doc.type] ?? doc.type}</span>
				{/if}
				{#each doc.tags ?? [] as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
			<a
				class="btn btn-primary"
				id="download"
				href={`${API_BASE}/docs/${doc.id}/download`}
				onclick={() => trackEvent('doc_downloaded', { id: doc.id, title: doc.title })}
			>
				{$t('actions.download')}
			</a>
			<div class="flex flex-wrap gap-2">
				<button
					class="btn btn-ghost"
					type="button"
					onclick={() => handleCopy('link', location.href)}
				>
					{$t('actions.copyLink')}
				</button>
				<button
					class="btn btn-ghost"
					type="button"
					onclick={() => handleCopy('content', doc.content ?? '')}
				>
					{$t('actions.copyContent')}
				</button>
			</div>
			{#if copyStatus}
				<div class="text-xs text-muted" role="status" aria-live="polite">
					{#if copyStatus === 'link'}
						{$t('feedback.copyLinkSuccess')}
					{:else if copyStatus === 'content'}
						{$t('feedback.copyContentSuccess')}
					{:else}
						{$t('feedback.copyFailure')}
					{/if}
				</div>
			{/if}
			{#if related?.length}
				<div class="grid gap-2">
					<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
						{$t('detail.related')}
					</div>
					<div class="grid gap-2">
						{#each related as item}
							<button
								class="w-full rounded-xl border border-border/70 bg-surface/70 px-3 py-2 text-left text-xs font-semibold text-ink transition hover:border-border"
								type="button"
								onclick={() => onSelectRelated(item)}
								aria-label={$t('actions.view', { title: item.title })}
							>
								{item.title}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		{:else}
			<div class="text-sm text-muted">{$t('states.emptyDetail')}</div>
		{/if}
	</aside>
</div>
