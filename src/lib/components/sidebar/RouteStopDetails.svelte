<script lang="ts">
	let { stop, index } = $props();

	function formatDetourTime(detourTimeInSeconds: number) {
		const minutes = Math.max(1, Math.round(detourTimeInSeconds / 60));
		return `${minutes} min`;
	}
</script>

<div class="flex items-center justify-between gap-3">
	<p class="font-label text-[10px] font-bold tracking-widest text-primary uppercase">
		Stop {String(index + 1).padStart(2, '0')}
	</p>
	<p class="text-[10px] tracking-wide text-on-surface-variant uppercase">
		{(stop.detourDistance / 1000).toFixed(1)} km · {formatDetourTime(stop.detourTime)}
	</p>
</div>
<p class="mt-1 font-headline text-sm font-bold text-white uppercase">
	{stop.identifier.name}
</p>
<p class="mt-1 text-[10px] tracking-wide text-on-surface-variant uppercase">
	{stop.identifier.type} · {stop.identifier.address}
</p>
