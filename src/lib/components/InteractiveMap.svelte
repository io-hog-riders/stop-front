<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import ActiveScanOverlay from './map/ActiveScanOverlay.svelte';
	import TripDataOverlay from './map/TripDataOverlay.svelte';
	import MapControls from './map/MapControls.svelte';
	import CoordinatesOverlay from './map/CoordinatesOverlay.svelte';

	let mapContainer: HTMLElement;
	let lng = $state(-87.6298);
	let lat = $state(41.8781);
	let mapInstance = $state<maplibregl.Map | null>(null);

	$effect(() => {
		if (!mapContainer) return;

		const map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
			center: [-87.6298, 41.8781],
			zoom: 11,
			attributionControl: false
		});

		map.on('load', () => {
			const routeCoordinates = [
				[-87.68, 41.8],
				[-87.65, 41.83],
				[-87.6298, 41.8781],
				[-87.61, 41.9],
				[-87.6, 41.95]
			];

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

			const stops = [
				[-87.68, 41.8],
				[-87.6298, 41.8781],
				[-87.6, 41.95]
			];

			stops.forEach((coord) => {
				const el = document.createElement('div');
				el.className =
					'h-6 w-6 border-[3px] border-black bg-secondary shadow-[4px_4px_0px_0px_var(--color-secondary)]';

				new maplibregl.Marker({ element: el }).setLngLat(coord as [number, number]).addTo(map);
			});
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

<main class="absolute top-20 right-0 bottom-0 left-80 overflow-hidden p-8">
	<!-- Interactive Map Placeholder -->
	<div
		class="relative h-full w-full overflow-hidden border-[3px] border-white bg-surface-container-low"
	>
		<div bind:this={mapContainer} class="h-full w-full bg-black"></div>
		<!-- Map Overlay UI Elements -->
		<ActiveScanOverlay />
		<MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
		<!-- Route Info Overlay -->
		<TripDataOverlay />
	</div>
	<!-- Bottom Status Bar (Desktop) -->
	<CoordinatesOverlay {lat} {lng} />
</main>
