<script lang="ts">
	/* this is the sidebar tab for the planning mode, which allows the user
	to choose the start/end points and intended stop count
	 */
	import StopConfigEntry from '$lib/components/sidebar/StopConfigEntry.svelte';
	import LocationEntry from '$lib/components/sidebar/LocationEntry.svelte';
	import type { Coordinates, PathPlanningInput } from '$lib/types/mapTypes';

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
		if (!originCoords || !destinationCoords) {
			calculateMessage = 'Resolve both Start point and Destination before calculating path.';
			return;
		}

		await onCalculatePath?.({
			startLocation,
			destinationLocation,
			origin: originCoords,
			destination: destinationCoords
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
		<!-- Max Journey Deviation -->
		<div class="space-y-2 pt-2">
			<div class="flex items-center justify-between">
				<label class="font-label text-xs font-bold tracking-widest text-primary uppercase"
					>Max Deviation</label
				>
				<span class="font-headline text-xs font-bold text-primary">15 KM / 10 MIN</span>
			</div>
			<input
				class="w-full cursor-pointer accent-primary"
				max="60"
				min="5"
				type="range"
				value="15"
			/>
		</div>
		<!-- Individual Stop Configuration -->
		<div class="space-y-4 border-t border-surface-variant pt-4">
			<h3 class="font-headline text-sm font-black tracking-tighter text-primary uppercase">
				Individual Stop Config
			</h3>
			<StopConfigEntry index="01" stop_time="30 MIN" stop_type="Restaurant" />
			<StopConfigEntry index="02" stop_time="15 MIN" stop_type="Park" />
			<StopConfigEntry index="03" stop_time="1 HR" stop_type="Fuel" />
		</div>
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
			<div class="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-black"></div>
		</button>
	</div>
</div>
