<script lang="ts">
	let { progress } = $props<{ progress: number }>();
</script>

<div
	class="fixed top-[77px] left-0 z-40 h-2 w-full bg-surface-variant md:left-64 md:w-[calc(100%-16rem)]"
>
	<div
		class="h-full bg-primary shadow-[0px_0px_10px_var(--color-primary)] transition-all duration-300"
		style="width: {progress}%"
	></div>
</div>
