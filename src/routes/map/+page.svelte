<script lang="ts">
	import TopAppBar from '$lib/components/TopAppBar.svelte';
	import SideNavBar from '$lib/components/SideNavBar.svelte';
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';

	import MobileNavigation from '$lib/components/MobileNavigation.svelte';

	import type { PathPlanningInput, RouteStop } from '$lib/types/mapTypes';
	type RoutePlanResponse = {
		route?: {
			points?: Array<{ lng: number; lat: number }>;
			distance?: number;
		};
		suggestedStops?: Array<{
			detourDistance: number;
			detourTime: number;
			ident: RouteStop['identifier'];
			openingHours: RouteStop['openingHours'];
			rating: RouteStop['rating'];
			website: string;
		}>;
	};

	let isFetching = $state(false);

	let pathPoints = $state<Array<[number, number]>>([]);
	let routeStops = $state<RouteStop[]>([]);
	let selectedRouteStops = $state<RouteStop[]>([]);
	let routeDistance = $state(0);

	let extractPathPoints = (data: RoutePlanResponse): Array<[number, number]> => {
		if (!data || !data.route?.points) {
			console.warn('Invalid data format: missing route.points');
			return [];
		}
		return data.route.points.map((point) => [point.lng, point.lat] as [number, number]);
	};

	function handleSelectedRouteStopsChange(nextSelectedRouteStops: RouteStop[]) {
		selectedRouteStops = nextSelectedRouteStops;
	}

	let extractSuggestedStops = (data: RoutePlanResponse): RouteStop[] => {
		if (!data || !data.suggestedStops) {
			console.warn('Invalid data format: missing route.suggestedStops');
			return [];
		}
		return data.suggestedStops.map((stop) => ({
			detourDistance: stop.detourDistance,
			detourTime: stop.detourTime,
			identifier: stop.ident,
			openingHours: stop.openingHours,
			rating: stop.rating,
			website: stop.website
		}));
	};

	async function handleCalculatePath(planningInput: PathPlanningInput) {
		if (isFetching) return;

		isFetching = true;

		try {
			const response = await fetch('/test/temp/route/plan', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(planningInput)
			});

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			const data = (await response.json()) as RoutePlanResponse;
			pathPoints = extractPathPoints(data);
			routeStops = extractSuggestedStops(data);
			routeDistance = data.route?.distance || 0;
			selectedRouteStops = [];
		} catch (error) {
			const details = error instanceof Error ? error.message : 'Unknown error';
			console.error(`Could not fetch route preview: ${details}`);
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
	<SideNavBar
		onCalculatePath={handleCalculatePath}
		{selectedRouteStops}
		{pathPoints}
		{routeDistance}
	/>
	<InteractiveMap
		{pathPoints}
		{routeStops}
		onSelectedRouteStopsChange={handleSelectedRouteStopsChange}
	/>
	<MobileNavigation />
</div>
