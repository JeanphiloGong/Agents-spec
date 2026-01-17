<script lang="ts">
	import { t } from '$lib/i18n';
	import type { DocItem } from '$lib/types/docs';

	type Props = {
		items: DocItem[];
		error: string;
		isLoading: boolean;
		onSelect: (doc: DocItem) => void;
		onRetry: () => void;
	};

	let { items, error, isLoading, onSelect, onRetry } = $props<Props>();

	const typeLabels: Record<string, string> = $derived({
		spec: $t('filters.typeSpec'),
		template: $t('filters.typeTemplate'),
		tutorial: $t('filters.typeTutorial')
	});
</script>

<div class="mt-6" aria-live="polite" aria-busy={isLoading}>
	{#if error}
		<div class="card grid gap-3 p-4" role="alert">
			<div class="flex items-center gap-2 text-sm font-semibold text-danger">
				<span aria-hidden="true">!</span>
				<span>{$t('states.errorList')}</span>
			</div>
			<button class="btn btn-ghost w-fit" type="button" onclick={onRetry}>
				{$t('actions.retry')}
			</button>
		</div>
	{:else if isLoading}
		<div class="sr-only" role="status">{$t('states.loadingList')}</div>
		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
			<div class="card grid gap-3 p-4" aria-hidden="true">
				<div class="skeleton-line h-4 w-3/5"></div>
				<div class="skeleton-line h-3"></div>
				<div class="skeleton-line h-3 w-4/5"></div>
			</div>
			<div class="card grid gap-3 p-4" aria-hidden="true">
				<div class="skeleton-line h-4 w-1/2"></div>
				<div class="skeleton-line h-3"></div>
				<div class="skeleton-line h-3 w-3/4"></div>
			</div>
			<div class="card grid gap-3 p-4" aria-hidden="true">
				<div class="skeleton-line h-4 w-2/3"></div>
				<div class="skeleton-line h-3"></div>
				<div class="skeleton-line h-3 w-1/2"></div>
			</div>
		</div>
	{:else if items?.length}
		<ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list" data-testid="doc-list">
			{#each items as item, index}
				<li>
					<button
						class="card card-hover fade-up grid cursor-pointer gap-3 p-5 text-left"
						type="button"
						style={`animation-delay:${index * 60}ms;`}
						onclick={() => onSelect(item)}
						aria-label={$t('actions.view', { title: item.title })}
						data-testid="doc-card"
					>
						<div class="flex items-start justify-between gap-3">
							<div class="grid gap-1">
								<div class="text-base font-semibold text-ink">{item.title}</div>
								<div class="text-xs text-muted">{item.path}</div>
							</div>
							{#if item.type}
								<span class="tag">{typeLabels[item.type] ?? item.type}</span>
							{/if}
						</div>
						<p class="m-0 text-sm text-muted leading-relaxed">
							{@html item.excerpt}
						</p>
						<div class="flex flex-wrap gap-2">
							<span class="tag">{item.dept}</span>
							<span class="tag">{item.role}</span>
							{#each item.tags?.slice(0, 3) ?? [] as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="card p-4 text-sm text-muted">{$t('states.emptyList')}</div>
	{/if}
</div>
