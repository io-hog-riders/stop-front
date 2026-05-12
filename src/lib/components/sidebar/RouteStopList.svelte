<script lang="ts">
	import RouteStopDetails from '$lib/components/sidebar/RouteStopDetails.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import type { RouteStop } from '$lib/types/mapTypes';

	const CARD_ANIMATION_MS = 180;

	type Props = {
		selectedRouteStops: RouteStop[];
		onRemove?: (stop: RouteStop) => void;
	};

	let { selectedRouteStops, onRemove }: Props = $props();
</script>

{#each selectedRouteStops as stop, index (stop.identifier.id)}
	<div
		animate:flip={{ duration: CARD_ANIMATION_MS }}
		in:fly={{ x: 12, y: 8, duration: CARD_ANIMATION_MS }}
		out:fly={{ x: 12, y: -8, duration: CARD_ANIMATION_MS }}
		class="border border-surface-variant bg-surface-container-low p-3"
	>
		<RouteStopDetails {stop} {index} onRemove={() => onRemove?.(stop)} />
	</div>
{/each}
