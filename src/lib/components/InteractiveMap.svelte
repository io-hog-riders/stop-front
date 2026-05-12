<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import MapControls from './map/MapControls.svelte';
	import StopMarker from './map/StopMarker.svelte';
	import StopSelectionNotifications from './map/StopSelectionNotifications.svelte';
	import type { RouteStop, StopType } from '$lib/types/mapTypes';
	import type { UsageTypeMeta } from '$lib/stores/usagePreference.svelte';

	type Props = {
		pathPoints: Array<[number, number]>;
		routeStops: RouteStop[];
		selectedRouteStops?: RouteStop[];
		isFetching?: boolean;
		appliedUsageType?: UsageTypeMeta | null;
		missingStopsEvent?: { id: number; types: StopType[] } | null;
		onSelectedRouteStopsChange?: (selectedStops: RouteStop[]) => void;
	};

	let {
		pathPoints,
		routeStops,
		selectedRouteStops = [],
		isFetching = false,
		appliedUsageType = null,
		missingStopsEvent = null,
		onSelectedRouteStopsChange
	}: Props = $props();
	let stopSelectionEventId = 0;
	let latestStopSelectionEvent: {
		id: number;
		stopName: string;
		variant: 'selected' | 'deselected';
	} | null = $state(null);
	let mapContainer: HTMLElement;
	let mapInstance = $state<maplibregl.Map | null>(null);
	let mapLoaded = $state(false);
	let startMarker: maplibregl.Marker | null = null;
	let endMarker: maplibregl.Marker | null = null;
	let hasFitInitialBounds = false;

	function handleSelectStop(stop: RouteStop) {
		const isAlreadySelected = selectedRouteStops.some(
			(selectedStop) => selectedStop.identifier.id === stop.identifier.id
		);

		if (isAlreadySelected) {
			const nextSelectedRouteStops = selectedRouteStops.filter(
				(selectedStop) => selectedStop.identifier.id !== stop.identifier.id
			);
			onSelectedRouteStopsChange?.(nextSelectedRouteStops);
			latestStopSelectionEvent = {
				id: ++stopSelectionEventId,
				stopName: stop.identifier.name,
				variant: 'deselected'
			};
			return;
		}

		const nextSelectedRouteStops = [...selectedRouteStops, stop];
		onSelectedRouteStopsChange?.(nextSelectedRouteStops);
		latestStopSelectionEvent = {
			id: ++stopSelectionEventId,
			stopName: stop.identifier.name,
			variant: 'selected'
		};
	}

	// Create the map once. Route-line and endpoint markers are managed by the
	// separate effect below so route updates don't tear down the whole map.
	$effect(() => {
		if (!mapContainer) return;

		const map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
			center: [0, 0],
			zoom: 1,
			attributionControl: false
		});

		map.on('load', () => {
			mapLoaded = true;
		});

		mapInstance = map;

		return () => {
			map.remove();
			mapInstance = null;
			mapLoaded = false;
			startMarker = null;
			endMarker = null;
			hasFitInitialBounds = false;
		};
	});

	$effect(() => {
		if (!mapInstance || !mapLoaded) return;
		const map = mapInstance;
		const points = pathPoints;

		if (points.length < 2) {
			if (map.getLayer('route-line')) map.removeLayer('route-line');
			if (map.getSource('route')) map.removeSource('route');
			startMarker?.remove();
			endMarker?.remove();
			startMarker = null;
			endMarker = null;
			return;
		}

		const data: GeoJSON.Feature<GeoJSON.LineString> = {
			type: 'Feature',
			properties: {},
			geometry: { type: 'LineString', coordinates: points }
		};

		const existingSource = map.getSource('route') as maplibregl.GeoJSONSource | undefined;
		if (existingSource) {
			existingSource.setData(data);
		} else {
			map.addSource('route', { type: 'geojson', data });
			map.addLayer({
				id: 'route-line',
				type: 'line',
				source: 'route',
				layout: { 'line-join': 'miter', 'line-cap': 'butt' },
				paint: { 'line-color': '#CCFF00', 'line-width': 5 }
			});
		}

		const start = points[0];
		const end = points[points.length - 1];

		if (startMarker) {
			startMarker.setLngLat(start);
		} else {
			startMarker = new maplibregl.Marker({ color: 'var(--color-primary)' })
				.setLngLat(start)
				.addTo(map);
		}
		if (endMarker) {
			endMarker.setLngLat(end);
		} else {
			endMarker = new maplibregl.Marker({ color: 'var(--color-tertiary)' })
				.setLngLat(end)
				.addTo(map);
		}

		if (!hasFitInitialBounds) {
			const bounds = new maplibregl.LngLatBounds(start, start);
			for (const point of points) bounds.extend(point);
			map.fitBounds(bounds, { padding: 60, animate: false });
			hasFitInitialBounds = true;
		}
	});

	function handleZoomIn() {
		mapInstance?.zoomIn();
	}

	function handleZoomOut() {
		mapInstance?.zoomOut();
	}
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, height=device-height, initial-scale:1, user-scalable=no"
	/>
</svelte:head>

<main class="absolute top-20 right-0 bottom-0 left-80 overflow-hidden p-8">
	<!-- Interactive Map Placeholder -->
	<div
		class="relative h-full w-full overflow-hidden border-[3px] border-white bg-surface-container-low"
	>
		<div bind:this={mapContainer} class="h-full w-full bg-black"></div>
		<StopSelectionNotifications
			selectionEvent={latestStopSelectionEvent}
			{missingStopsEvent}
		/>
		<MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
		{#if isFetching}
			<div
				class="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-2 border-[3px] border-black bg-primary px-3 py-2 font-headline text-xs font-black tracking-tighter text-black uppercase shadow-[4px_4px_0px_0px_#000]"
				transition:fly={{ x: -24, duration: 260, easing: quintOut }}
			>
				<span
					class="block h-3 w-3 animate-spin border-[3px] border-black border-t-transparent"
				></span>
				<span class="recalc-label">Recalculating</span>
			</div>
		{/if}
		{#if mapInstance}
			{#each routeStops as stop (stop.identifier.id)}
				<StopMarker
					map={mapInstance}
					{stop}
					{appliedUsageType}
					isSelected={selectedRouteStops.some(
						(selected) => selected.identifier.id === stop.identifier.id
					)}
					onSelected={handleSelectStop}
				/>
			{/each}
		{/if}
	</div>
</main>

<style>
	.recalc-label::after {
		content: '';
		display: inline-block;
		width: 1.25em;
		text-align: left;
		animation: recalc-dots 1.4s steps(1, end) infinite;
	}

	@keyframes recalc-dots {
		0% {
			content: '';
		}
		25% {
			content: '.';
		}
		50% {
			content: '..';
		}
		75%,
		100% {
			content: '...';
		}
	}
</style>
