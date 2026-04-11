<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import ActiveScanOverlay from './map/ActiveScanOverlay.svelte';
	import TripDataOverlay from './map/TripDataOverlay.svelte';
	import MapControls from './map/MapControls.svelte';
	import CoordinatesOverlay from './map/CoordinatesOverlay.svelte';
    import StopMarker from './map/StopMarker.svelte';
    import type { RouteStop } from '$lib/types/mapTypes';

	let { pathPoints, routeStops }: { pathPoints: Array<[number, number]>; routeStops: RouteStop[] } = $props();
	let mapContainer: HTMLElement;
	let lng = $state(-87.6298);
	let lat = $state(41.8781);
	let mapInstance = $state<maplibregl.Map | null>(null);

	$effect(() => {
		if (!mapContainer) return;

		const map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
			center: [pathPoints.length > 0 ? pathPoints[0][0] : 0, pathPoints.length > 0 ? pathPoints[0][1] : 0],
			zoom: pathPoints.length == 0 ? 1 : 6,
			attributionControl: false
		});

		map.on('load', () => {
			const routeCoordinates = pathPoints;

			if (routeCoordinates.length > 1) {
				map.addSource('route', {
					type: 'geojson',
					data: {
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'LineString',
							coordinates: routeCoordinates
						}
					}
				});

				map.addLayer({
					id: 'route-line',
					type: 'line',
					source: 'route',
					layout: {
						'line-join': 'miter',
						'line-cap': 'butt'
					},
					paint: {
						'line-color': '#CCFF00',
						'line-width': 5
					}
				});

				new maplibregl.Marker({ color: 'var(--color-primary)' }).setLngLat(routeCoordinates[0]).addTo(map);

				new maplibregl.Marker({ color: 'var(--color-tertiary)' })
					.setLngLat(routeCoordinates[routeCoordinates.length - 1])
					.addTo(map);
			}
		});

		map.on('mousemove', (e) => {
			lng = e.lngLat.lng;
			lat = e.lngLat.lat;
		});

		mapInstance = map;

		return () => {
			map.remove();
			mapInstance = null;
		};
	});

	function handleZoomIn() {
		mapInstance?.zoomIn();
	}

	function handleZoomOut() {
		mapInstance?.zoomOut();
	}
</script>

<svelte:head>
	<meta name='viewport' content='width=device-width, height=device-height, initial-scale:1, user-scalable=no' />
</svelte:head>

<main class="absolute top-20 right-0 bottom-0 left-80 overflow-hidden p-8">
	<!-- Interactive Map Placeholder -->
	<div
		class="relative h-full w-full overflow-hidden border-[3px] border-white bg-surface-container-low"
	>
		<div bind:this={mapContainer} class="h-full w-full bg-black"></div>
		<!-- Map Overlay UI Elements
		<ActiveScanOverlay /> -->
		<MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
		<!-- Route Info Overlay
		<TripDataOverlay /> -->
		{#if mapInstance}
			{#each routeStops as stop (stop.identifier.id)}
				<StopMarker map={mapInstance} {stop} />
			{/each}
		{/if}
	</div>
	<!-- Bottom Status Bar (Desktop) -->
	<CoordinatesOverlay {lat} {lng} />
</main>
