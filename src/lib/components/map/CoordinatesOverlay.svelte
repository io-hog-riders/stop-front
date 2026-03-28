<script lang="ts">
	let { lat, lng } = $props<{ lat: number; lng: number }>();
</script>

<div
	class="pointer-events-none absolute right-12 bottom-12 left-12 flex min-w-80 items-end justify-between"
>
	<div class="pointer-events-auto w-72 border-[3px] border-white bg-black p-2 px-4 text-center">
		<span class="font-label text-xs font-bold text-white uppercase tabular-nums"
			>Coords: {Math.abs(lat).toFixed(4)}° {lat >= 0 ? 'N' : 'S'}, {Math.abs(lng).toFixed(4)}° {lng >=
			0
				? 'E'
				: 'W'}</span
		>
	</div>
</div>
