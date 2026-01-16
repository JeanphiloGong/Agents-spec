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
		doc: DocItem | null;
		html: string;
		isLoading: boolean;
	};

	let { doc, html, isLoading } = $props<Props>();
</script>

<div style="display:grid;grid-template-columns:1.3fr 0.7fr;gap:24px;margin-top:24px;">
	<div class="glass-card" style="padding:24px;">
		{#if isLoading}
			<div class="skeleton-line" style="width:55%;height:22px;"></div>
			<div class="skeleton-line" style="height:14px;"></div>
			<div class="skeleton-line" style="height:14px;width:80%;"></div>
		{:else if doc}
			<h2 style="margin:0 0 10px;">{doc.title}</h2>
			<article style="color:var(--muted);line-height:1.7;" class="markdown-body">
				{@html html}
			</article>
		{:else}
			<h2 style="margin:0 0 10px;">选择一篇文档</h2>
			<p style="color:var(--muted);line-height:1.7;margin-top:0;">
				点击列表中的 AGENTS.md 查看详细内容与下载入口。
			</p>
		{/if}
	</div>
	<aside class="glass-card" style="padding:20px;display:grid;gap:12px;">
		{#if isLoading}
			<div class="skeleton-line" style="width:40%;height:14px;"></div>
			<div class="skeleton-line" style="width:60%;height:14px;"></div>
			<div class="skeleton-line" style="width:50%;height:14px;"></div>
		{:else if doc}
			<div>
				<div style="font-size:12px;color:var(--muted);">部门</div>
				<div style="font-weight:600;">{doc.dept}</div>
			</div>
			<div>
				<div style="font-size:12px;color:var(--muted);">角色</div>
				<div style="font-weight:600;">{doc.role}</div>
			</div>
			<div>
				<div style="font-size:12px;color:var(--muted);">更新时间</div>
				<div style="font-weight:600;">{new Date(doc.updated_at).toLocaleString()}</div>
			</div>
			<div style="display:flex;gap:10px;flex-wrap:wrap;">
				<span class="tag">{doc.type}</span>
				{#each doc.tags ?? [] as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
			<a
				class="button primary"
				id="download"
				href={`http://localhost:7070/api/docs/${doc.id}/download`}
			>
				下载原文
			</a>
		{:else}
			<div style="color:var(--muted);">请选择一篇文档以查看元信息。</div>
		{/if}
	</aside>
</div>
