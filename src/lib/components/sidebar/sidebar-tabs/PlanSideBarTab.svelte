<script lang="ts">
	/* this is the sidebar tab for the planning mode, which allows the user
	to choose the start/end points and intended stop count
	 */
	import StopConfigList from '$lib/components/sidebar/StopConfigList.svelte';
	import LocationEntry from '$lib/components/sidebar/LocationEntry.svelte';
	import type {
		Coordinates,
		PathPlanningInput,
		RankingPriority,
		StopConfig
	} from '$lib/types/mapTypes';

	type GeocodeStatus = 'idle' | 'resolving' | 'resolved' | 'not-found' | 'error';

	type Props = {
		onCalculatePath?: (planningInput: PathPlanningInput) => void | Promise<void>;
	};

	let { onCalculatePath }: Props = $props();

	let startLocation = $state('Kraków, PL');
	let destinationLocation = $state('');

	let originCoords = $state<Coordinates | null>(null);
	let destinationCoords = $state<Coordinates | null>(null);

	let startStatus = $state<GeocodeStatus>('idle');
	let destinationStatus = $state<GeocodeStatus>('idle');
	let calculateMessage = $state('');
	let stopConfigs = $state<StopConfig[]>([]);
	let rankingPriority = $state<RankingPriority>('detour_distance');

	const DEFAULT_SUGGESTION_LIMIT = 6;
	const rankingPriorityInputId = 'ranking-priority';

	function clearStartCoordinateIfNeeded() {
		originCoords = null;
		startStatus = startLocation.trim() ? 'idle' : 'not-found';
		calculateMessage = '';
	}

	function clearDestinationCoordinateIfNeeded() {
		destinationCoords = null;
		destinationStatus = destinationLocation.trim() ? 'idle' : 'not-found';
		calculateMessage = '';
	}

	async function geocodeLocation(query: string): Promise<Coordinates | null> {
		const trimmedQuery = query.trim();
		if (!trimmedQuery) return null;

		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(trimmedQuery)}`
		);

		if (!response.ok) {
			throw new Error(`Geocoder request failed with status ${response.status}`);
		}

		const results: Array<{ lat: string; lon: string }> = await response.json();
		if (!results.length) {
			return null;
		}

		const latitude = Number(results[0].lat);
		const longitude = Number(results[0].lon);
		if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
			return null;
		}

		return { lat: latitude, lng: longitude };
	}

	async function resolveStartLocation() {
		const trimmedStart = startLocation.trim();
		if (!trimmedStart) {
			originCoords = null;
			startStatus = 'not-found';
			return;
		}

		startStatus = 'resolving';
		calculateMessage = '';

		try {
			const resolvedCoords = await geocodeLocation(trimmedStart);
			if (!resolvedCoords) {
				originCoords = null;
				startStatus = 'not-found';
				return;
			}

			originCoords = resolvedCoords;
			startStatus = 'resolved';
		} catch (error) {
			console.error('Failed to geocode start location', error);
			originCoords = null;
			startStatus = 'error';
		}
	}

	async function resolveDestinationLocation() {
		const trimmedDestination = destinationLocation.trim();
		if (!trimmedDestination) {
			destinationCoords = null;
			destinationStatus = 'not-found';
			return;
		}

		destinationStatus = 'resolving';
		calculateMessage = '';

		try {
			const resolvedCoords = await geocodeLocation(trimmedDestination);
			if (!resolvedCoords) {
				destinationCoords = null;
				destinationStatus = 'not-found';
				return;
			}

			destinationCoords = resolvedCoords;
			destinationStatus = 'resolved';
		} catch (error) {
			console.error('Failed to geocode destination location', error);
			destinationCoords = null;
			destinationStatus = 'error';
		}
	}

	function statusCopy(status: GeocodeStatus): string {
		switch (status) {
			case 'resolving':
				return 'Resolving location...';
			case 'resolved':
				return 'Location resolved';
			case 'not-found':
				return 'Location not found';
			case 'error':
				return 'Geocoder failed';
			default:
				return '';
		}
	}

	async function handleCalculatePathClick() {
		calculateMessage = '';

		if (!originCoords && startLocation.trim()) {
			await resolveStartLocation();
		}
		if (!destinationCoords && destinationLocation.trim()) {
			await resolveDestinationLocation();
		}

		if (!originCoords || !destinationCoords) {
			calculateMessage = 'Resolve both Start point and Destination before calculating path.';
			return;
		}

		const hasInvalidStopConfig = stopConfigs.some(
			(config) => config.targetPercent < 1 || config.targetPercent > 100
		);
		if (hasInvalidStopConfig) {
			calculateMessage = 'Every stop target must be between 1 and 100 percent.';
			return;
		}

		await onCalculatePath?.({
			startLocation,
			destinationLocation,
			origin: originCoords,
			destination: destinationCoords,
			stopConfigs,
			suggestionLimit: DEFAULT_SUGGESTION_LIMIT,
			rankingPriority
		});
	}
</script>

<div>
	<!-- Input Controls -->
	<div class="space-y-6 p-6">
		<!-- Location Inputs -->
		<div class="space-y-4">
			<div>
				<LocationEntry
					label="Start point"
					bind:value={startLocation}
					onBlurAction={resolveStartLocation}
					onInputAction={clearStartCoordinateIfNeeded}
				/>
				{#if statusCopy(startStatus)}
					<p class="mt-2 font-label text-xs text-primary">{statusCopy(startStatus)}</p>
				{/if}
			</div>
			<div>
				<LocationEntry
					label="Destination"
					symbol="flag"
					bind:value={destinationLocation}
					onBlurAction={resolveDestinationLocation}
					onInputAction={clearDestinationCoordinateIfNeeded}
				/>
				{#if statusCopy(destinationStatus)}
					<p class="mt-2 font-label text-xs text-primary">
						{statusCopy(destinationStatus)}
					</p>
				{/if}
			</div>
		</div>
		<div class="space-y-2 border-t border-surface-variant pt-4">
			<label
				for={rankingPriorityInputId}
				class="font-label text-xs font-bold tracking-widest text-primary uppercase"
				>Ranking Priority</label
			>
			<select
				id={rankingPriorityInputId}
				class="w-full border-2 border-outline bg-black p-2 font-headline text-xs text-white uppercase outline-none focus:border-primary"
				bind:value={rankingPriority}
			>
				<option value="detour_distance">Shortest detour distance</option>
				<option value="detour_time">Shortest detour time</option>
				<option value="rating">Highest rating</option>
			</select>
		</div>

		<StopConfigList bind:stopConfigs />
	</div>
	<!-- Sidebar Footer CTA -->
	<div class="border-t-[3px] border-primary bg-surface-container-highest p-6">
		{#if calculateMessage}
			<p class="mb-3 font-label text-xs text-primary">{calculateMessage}</p>
		{/if}
		<button
			class="group relative w-full border-[3px] border-black bg-primary py-4 font-headline text-lg font-black tracking-tighter text-black uppercase transition-transform active:translate-x-1 active:translate-y-1"
			onclick={handleCalculatePathClick}
		>
			CALCULATE PATH
			<span class="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-black"></span>
		</button>
	</div>
</div>
