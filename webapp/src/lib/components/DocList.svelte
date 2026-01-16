<script lang="ts">
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

	type Props = {
		items: DocItem[];
		error: string;
		isLoading: boolean;
		onSelect: (doc: DocItem) => void;
	};

	let { items, error, isLoading, onSelect } = $props<Props>();
</script>

<div class="card-grid" style="margin-top:28px;">
	{#if error}
		<div class="glass-card" style="padding:18px;color:#9b2c2c;">
			{error}
		</div>
	{:else if isLoading}
		<div class="glass-card" style="padding:18px;display:grid;gap:12px;">
			<div class="skeleton-line" style="width:60%;"></div>
			<div class="skeleton-line"></div>
			<div class="skeleton-line" style="width:80%;"></div>
		</div>
		<div class="glass-card" style="padding:18px;display:grid;gap:12px;">
			<div class="skeleton-line" style="width:55%;"></div>
			<div class="skeleton-line"></div>
			<div class="skeleton-line" style="width:70%;"></div>
		</div>
	{:else if items?.length}
		{#each items as item, index}
			<button
				class="glass-card card fade-up"
				type="button"
				style={`padding:18px;display:grid;gap:10px;text-align:left;border:none;cursor:pointer;animation-delay:${index * 60}ms;`}
				onclick={() => onSelect(item)}
				aria-label={`查看 ${item.title}`}
			>
				<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
					<div>
						<div style="font-weight:700;">{item.title}</div>
						<div style="font-size:12px;color:var(--muted);">{item.path}</div>
					</div>
					<span class="tag">{item.type}</span>
				</div>
				<p style="color:var(--muted);margin:0;">
					{item.excerpt}
				</p>
				<div style="display:flex;gap:10px;flex-wrap:wrap;">
					<span class="tag">{item.dept}</span>
					<span class="tag">{item.role}</span>
					{#each item.tags?.slice(0, 3) ?? [] as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			</button>
		{/each}
	{:else}
		<div class="glass-card" style="padding:18px;color:var(--muted);">
			暂无匹配的 AGENTS.md 结果。
		</div>
	{/if}
</div>
