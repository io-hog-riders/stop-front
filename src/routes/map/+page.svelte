<script lang="ts">
	import { onMount } from 'svelte';

	import TopAppBar from '$lib/components/TopAppBar.svelte';
	import SideNavBar from '$lib/components/SideNavBar.svelte';
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';

	import UsageTypeModal from '$lib/components/UsageTypeModal.svelte';

	import { usagePreference } from '$lib/stores/usagePreference.svelte';

	import type { PathPlanningInput, RouteStop, StopConfig, StopType } from '$lib/types/mapTypes';
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
			website: string;
		}>;
	};

	type StopOptionsPayload = {
		type: StopConfig['stopType'];
		targetPercent: number;
		atJourneyMinute: number;
		maxDetour: number;
		limit: number;
	};

	const DEFAULT_MAX_DETOUR_METERS = 15000;
	const DEFAULT_PER_TYPE_LIMIT = 10;

	let isFetching = $state(false);
	let usageModalOpen = $state(false);
	let usageModalFirstVisit = $state(false);
	let appliedUsageType = $state<ReturnType<typeof usagePreference.meta>>(null);
	let missingStopsEvent = $state<{ id: number; types: StopType[] } | null>(null);
	let missingStopsEventId = 0;

	// When a selection-driven recalc arrives while another fetch is in flight,
	// we stash the latest request and re-fire it after the current one finishes
	// — so every click on a stop is reflected in the route line.
	let pendingRecalc: { input: PathPlanningInput; preserveStops: boolean } | null = null;

	onMount(() => {
		if (!usagePreference.hasSeenPrompt) {
			usageModalFirstVisit = true;
			usageModalOpen = true;
		}
	});

	let pathPoints = $state<Array<[number, number]>>([]);
	let routeStops = $state<RouteStop[]>([]);
	let selectedRouteStops = $state<RouteStop[]>([]);
	let routeDistance = $state(0);
	let lastPlanningInput = $state<PathPlanningInput | null>(null);

	let extractPathPoints = (data: RoutePlanResponse): Array<[number, number]> => {
		if (!data || !data.route?.points) {
			console.warn('Invalid data format: missing route.points');
			return [];
		}
		return data.route.points.map((point) => [point.lng, point.lat] as [number, number]);
	};

	function handleSelectedRouteStopsChange(nextSelectedRouteStops: RouteStop[]) {
		selectedRouteStops = nextSelectedRouteStops;
		if (lastPlanningInput) {
			// Redraw the route line through the updated selection. If a fetch is
			// already in flight, handleCalculatePath will queue this and run it
			// when the current one settles.
			handleCalculatePath(lastPlanningInput, { preserveStops: true });
		}
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
			website: stop.website
		}));
	};

	async function handleCalculatePath(
		planningInput: PathPlanningInput,
		{ preserveStops = false }: { preserveStops?: boolean } = {}
	) {
		if (isFetching) {
			// Latest pending wins — older queued requests are stale.
			pendingRecalc = { input: planningInput, preserveStops };
			return;
		}

		lastPlanningInput = planningInput;
		isFetching = true;

		// A user-initiated Calculate Path produces a fresh suggestion set; old
		// selections likely won't appear in it, so drop them rather than pin
		// the new route through stops the user can no longer see.
		if (!preserveStops) {
			selectedRouteStops = [];
		}

		let waypoints = [planningInput.origin];
		for (const stop of selectedRouteStops) {
			waypoints.push(stop.identifier.location);
		}
		waypoints.push(planningInput.destination);

		const stopOptions: StopOptionsPayload[] = preserveStops
			? []
			: planningInput.stopConfigs.map((cfg) => ({
					type: cfg.stopType,
					targetPercent: cfg.targetPercent,
					atJourneyMinute: 0,
					maxDetour: DEFAULT_MAX_DETOUR_METERS,
					limit: DEFAULT_PER_TYPE_LIMIT
				}));

		const person = usagePreference.current;
		const requestBody: {
			waypoints: typeof waypoints;
			stops_config: { stops: StopOptionsPayload[] };
			routeOptions?: { person: NonNullable<typeof person> };
		} = {
			waypoints,
			stops_config: { stops: stopOptions }
		};

		if (person) {
			requestBody.routeOptions = { person };
		}

		const usageMetaAtFetch = usagePreference.meta(person);

		try {
			const response = await fetch('/api/v1/route/plan', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			const data = (await response.json()) as RoutePlanResponse;
			pathPoints = extractPathPoints(data);
			routeDistance = data.route?.distance || 0;
			if (!preserveStops) {
				const nextRouteStops = extractSuggestedStops(data);
				routeStops = nextRouteStops;
				appliedUsageType = usageMetaAtFetch;

				const returnedTypes = new Set(
					nextRouteStops.map((stop) => stop.identifier.type as StopType)
				);
				const configuredTypes = Array.from(
					new Set(planningInput.stopConfigs.map((cfg) => cfg.stopType))
				);
				const missingTypes = configuredTypes.filter((type) => !returnedTypes.has(type));
				if (missingTypes.length > 0) {
					missingStopsEvent = { id: ++missingStopsEventId, types: missingTypes };
				}
			}
		} catch (error) {
			const details = error instanceof Error ? error.message : 'Unknown error';
			console.error(`Could not fetch route preview: ${details}`);
		} finally {
			isFetching = false;
			if (pendingRecalc) {
				const next = pendingRecalc;
				pendingRecalc = null;
				handleCalculatePath(next.input, { preserveStops: next.preserveStops });
			}
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
		onSelectedRouteStopsChange={handleSelectedRouteStopsChange}
	/>
	<InteractiveMap
		{pathPoints}
		{routeStops}
		{selectedRouteStops}
		{isFetching}
		{appliedUsageType}
		{missingStopsEvent}
		onSelectedRouteStopsChange={handleSelectedRouteStopsChange}
	/>
</div>

<UsageTypeModal bind:open={usageModalOpen} firstVisit={usageModalFirstVisit} />
