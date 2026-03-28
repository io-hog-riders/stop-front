<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col pt-24 pb-32">
	{@render children()}
</div>
