<script lang="ts">
	import { formatNumber, locale, t } from '$lib/i18n';

	type Props = {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		isLoading: boolean;
		onPrev: () => void;
		onNext: () => void;
	};

	let { currentPage, totalPages, totalItems, isLoading, onPrev, onNext } = $props<Props>();
</script>

<nav class="flex flex-wrap items-center gap-3" aria-label={$t('aria.pagination')}>
	<button
		class="btn btn-ghost"
		type="button"
		disabled={isLoading || currentPage <= 1}
		onclick={onPrev}
	>
		{$t('actions.previous')}
	</button>
	<div class="text-sm text-muted" role="status" aria-live="polite">
		{$t('status.pagination', {
			current: formatNumber(currentPage, $locale),
			total: formatNumber(totalPages, $locale),
			count: formatNumber(totalItems, $locale)
		})}
	</div>
	<button
		class="btn btn-ghost"
		type="button"
		disabled={isLoading || currentPage >= totalPages}
		onclick={onNext}
	>
		{$t('actions.next')}
	</button>
</nav>
