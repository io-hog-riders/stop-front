<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/welcome');
	});
</script>

<div class="flex h-screen w-full items-center justify-center bg-background text-white">
	<p class="font-headline tracking-widest text-primary uppercase">Initializing Systems...</p>
</div>
