<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { RouteStop } from '$lib/types/mapTypes';
	import RouteStopList from '$lib/components/sidebar/RouteStopList.svelte';

	type Props = {
		selectedRouteStops?: RouteStop[];
		pathPoints?: Array<[number, number]>;
		routeDistance?: number;
		onSelectedRouteStopsChange?: (selectedStops: RouteStop[]) => void;
	};

	let {
		selectedRouteStops = [],
		pathPoints = [],
		routeDistance = 0,
		onSelectedRouteStopsChange
	}: Props = $props();

	function handleRemoveStop(stop: RouteStop) {
		const next = selectedRouteStops.filter((s) => s.identifier.id !== stop.identifier.id);
		onSelectedRouteStopsChange?.(next);
	}

	const CARD_ANIMATION_MS = 180;
	const EMPTY_TEXT_ANIMATION_MS = 160;
	// Google Maps /dir/?api=1 caps intermediate waypoints at 9.
	const GOOGLE_MAPS_MAX_WAYPOINTS = 9;

	const hasRouteEndpoints = $derived(pathPoints.length > 0);
	const startPoint = $derived(pathPoints[0]);
	const endPoint = $derived(pathPoints[pathPoints.length - 1]);
	const shouldShowEmptyState = $derived(selectedRouteStops.length === 0 && !hasRouteEndpoints);

	const googleMapsUrl = $derived.by(() => {
		if (!hasRouteEndpoints || !startPoint || !endPoint) return null;
		const [originLng, originLat] = startPoint;
		const [destLng, destLat] = endPoint;
		const params = new URLSearchParams({
			api: '1',
			origin: `${originLat},${originLng}`,
			destination: `${destLat},${destLng}`,
			travelmode: 'driving'
		});
		const waypointsList = selectedRouteStops
			.slice(0, GOOGLE_MAPS_MAX_WAYPOINTS)
			.map((stop) => `${stop.identifier.location.lat},${stop.identifier.location.lng}`)
			.join('|');
		if (waypointsList) params.set('waypoints', waypointsList);
		return `https://www.google.com/maps/dir/?${params.toString()}`;
	});

	const waypointsTruncated = $derived(selectedRouteStops.length > GOOGLE_MAPS_MAX_WAYPOINTS);

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

		<RouteStopList {selectedRouteStops} onRemove={handleRemoveStop} />

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

	{#if googleMapsUrl}
		<div class="mt-6 border-t-[3px] border-primary pt-6">
			<a
				href={googleMapsUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="flex w-full items-center justify-center gap-2 border-[3px] border-black bg-primary py-3 font-headline text-sm font-black tracking-tighter text-black uppercase transition-transform active:translate-x-1 active:translate-y-1"
			>
				<span class="material-symbols-outlined text-base">open_in_new</span>
				Open in Google Maps
			</a>
			{#if waypointsTruncated}
				<p class="mt-2 font-label text-[10px] tracking-widest text-error uppercase">
					Google Maps allows {GOOGLE_MAPS_MAX_WAYPOINTS} waypoints — only the first {GOOGLE_MAPS_MAX_WAYPOINTS}
					selected stops will be included.
				</p>
			{/if}
		</div>
	{/if}
</div>
