<script lang="ts">
	let { status = 'uninitialized' } = $props<{
		status?: 'uninitialized' | 'scanning' | 'finished';
	}>();
	let overlayData = $derived.by(() => {
		if (status === 'uninitialized')
			return {
				title: 'not scanning',
				description: 'use the left bar to start a new scan'
			};
		else if (status === 'scanning')
			return {
				title: 'active scan',
				description: 'detecting optimal stop nodes...'
			};
		else
			return {
				title: 'scan finished',
				description: 'the optimal stop nodes have been detected'
			};
	});
</script>

<div class="absolute top-6 left-6 space-y-4">
	<div
		class="inline-block border-[3px] border-secondary bg-black p-4 shadow-[8px_8px_0px_0px_var(--color-secondary)]"
	>
		<h3 class="font-headline text-2xl font-black tracking-tight text-secondary uppercase">
			{overlayData.title}
		</h3>
		<p class="font-label text-sm text-white opacity-80">{overlayData.description}</p>
	</div>
</div>
