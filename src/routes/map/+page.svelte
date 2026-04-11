<script lang="ts">
	import TopAppBar from '$lib/components/TopAppBar.svelte';
	import SideNavBar from '$lib/components/SideNavBar.svelte';
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';
	import MobileNavigation from '$lib/components/MobileNavigation.svelte';
	import type { RouteStop } from '$lib/types/mapTypes';

	let isFetching = $state(false);
	let fetchStatus = $state('');

	let pathPoints = $state<Array<[number, number]>>([]);
	let routeStops = $state<RouteStop[]>([]);

	// this all should have its own types defined somewhere, but for now we can just use any
	let extractPathPoints = (data: any): Array<[number, number]> => {
		if (!data || !data.route.points) {
			console.warn('Invalid data format: missing route.points');
			return [];
		}
		return data.route.points.map((point: any) => [point.lng, point.lat] as [number, number]);
	};

	let extractSuggestedStops = (data: any): RouteStop[] => {
		if (!data || !data.suggestedStops) {
			console.warn('Invalid data format: missing route.suggestedStops');
			return [];
		}
		let routeStops: RouteStop[] = data.suggestedStops.map((stop: any) => ({
			detourDistance: stop.detourDistance,
			detourTime: stop.detourTime,
			identifier: stop.ident,
			openingHours: stop.openingHours,
			rating: stop.rating,
			website: stop.website,
		}));
		return routeStops;
	};




	async function handleCalculatePath() {
		if (isFetching) {
			return;
		}

		isFetching = true;
		fetchStatus = 'Fetching route preview...';

		try {
			const response = await fetch('http://localhost:8000/api/mock/route/plan', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
				})
			});

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			const data = await response.json();
			console.log(data);
			fetchStatus = 'Route preview fetched successfully!';
			pathPoints = extractPathPoints(data);
			routeStops = extractSuggestedStops(data);
		} catch (error) {
			const details = error instanceof Error ? error.message : 'Unknown error';
			fetchStatus = `Could not fetch route preview: ${details}`;
		} finally {
			isFetching = false;
		}

	}
</script>

<svelte:head>
	<title>STOPFINDER - Planner</title>
</svelte:head>

<div class="relative h-screen w-full overflow-hidden">
	<TopAppBar />
	<SideNavBar onCalculatePath={handleCalculatePath} />
	<InteractiveMap pathPoints={pathPoints} routeStops={routeStops} />
	<MobileNavigation />
</div>
