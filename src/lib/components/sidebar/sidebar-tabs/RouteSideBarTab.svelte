<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { RouteStop } from '$lib/types/mapTypes';
	import RouteStopList from '$lib/components/sidebar/RouteStopList.svelte';

	type Props = {
		selectedRouteStops?: RouteStop[];
		pathPoints?: Array<[number, number]>;
		routeDistance?: number;
	};

	let { selectedRouteStops = [], pathPoints = [], routeDistance = 0 }: Props = $props();

	const CARD_ANIMATION_MS = 180;
	const EMPTY_TEXT_ANIMATION_MS = 160;

	const hasRouteEndpoints = $derived(pathPoints.length > 0);
	const startPoint = $derived(pathPoints[0]);
	const endPoint = $derived(pathPoints[pathPoints.length - 1]);
	const shouldShowEmptyState = $derived(selectedRouteStops.length === 0 && !hasRouteEndpoints);

	function formatCoordinate([lng, lat]: [number, number]): string {
		return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
	}
</script>

<div class="p-6">
	<h3 class="font-headline text-sm font-black tracking-tighter text-primary uppercase">
		Route Points
	</h3>

	{#if shouldShowEmptyState}
		<p
			in:fade={{ duration: EMPTY_TEXT_ANIMATION_MS }}
			out:fade={{ duration: EMPTY_TEXT_ANIMATION_MS }}
			class="mt-3 text-xs tracking-wide text-on-surface-variant uppercase"
		>
			To add route points, please first plan your route.
		</p>
	{/if}

	<div class="mt-4 space-y-3">
		{#if hasRouteEndpoints && startPoint}
			<div
				in:fly={{ x: 12, y: 8, duration: CARD_ANIMATION_MS }}
				out:fly={{ x: 12, y: -8, duration: CARD_ANIMATION_MS }}
				class="border border-primary bg-surface-container-low p-3"
			>
				<p class="font-label text-[10px] font-bold tracking-widest text-primary uppercase">
					Start
				</p>
				<p class="mt-1 font-headline text-sm font-bold text-white uppercase">Route Start</p>
				<p class="mt-1 text-[10px] tracking-wide text-on-surface-variant uppercase">
					{formatCoordinate(startPoint)}
				</p>
			</div>
		{/if}

		<RouteStopList {selectedRouteStops} />

		{#if hasRouteEndpoints && endPoint}
			<div
				in:fly={{ x: 12, y: 8, duration: CARD_ANIMATION_MS }}
				out:fly={{ x: 12, y: -8, duration: CARD_ANIMATION_MS }}
				class="border border-tertiary bg-surface-container-low p-3"
			>
				<p class="font-label text-[10px] font-bold tracking-widest text-tertiary uppercase">
					End
				</p>
				<p class="mt-1 font-headline text-sm font-bold text-white uppercase">Route End</p>
				<p class="mt-1 text-[10px] tracking-wide text-on-surface-variant uppercase">
					{formatCoordinate(endPoint)} · {routeDistance > 0 ? `${(routeDistance / 1000).toFixed(2)} km` : 'Distance N/A'}
				</p>
			</div>
		{/if}
	</div>
</div>
