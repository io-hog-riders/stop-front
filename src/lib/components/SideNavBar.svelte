<script lang="ts">
	import SideBarTab from './sidebar/SideBarTab.svelte';
	import PlanSideBarTab from '$lib/components/sidebar/sidebar-tabs/PlanSideBarTab.svelte';
	import RouteSideBarTab from '$lib/components/sidebar/sidebar-tabs/RouteSideBarTab.svelte';
	import type { RouteStop } from '$lib/types/mapTypes';
	type Props = {
		onCalculatePath?: () => void | Promise<void>;
		selectedRouteStops?: RouteStop[];
		pathPoints?: Array<[number, number]>;
	};

	let { onCalculatePath, selectedRouteStops = [], pathPoints = [] }: Props = $props();
	let selectedTab: 'plan' | 'route' = $state('plan');

</script>

<aside
	class="fixed top-20 left-0 z-40 flex h-[calc(100vh-5rem)] w-80 flex-col border-r-[3px] border-primary bg-[#0e0e0e] shadow-[8px_0px_0px_0px_var(--color-primary)]"
>
	<div class="border-b-[3px] border-primary p-6">
		<h2 class="font-headline text-xl font-black tracking-tighter text-primary uppercase">
			TRIP PARAMETERS
		</h2>
		<p class="font-label text-xs text-on-surface-variant">V1.0-OUTLAW</p>
	</div>
	<div class="flex-1">
		<!-- Navigation Links -->
		<div class="flex flex-col">
			<SideBarTab
				title="Plan"
				symbol="route"
				href="/map"
				selected={selectedTab === 'plan'}
				onClick={() => {
					selectedTab = 'plan';
				}}
			/>
			<SideBarTab
				title="Route"
				symbol="pin_drop"
				href="/map"
				selected={selectedTab === 'route'}
				onClick={() => {
					selectedTab = 'route';
				}}
			/>
		</div>
	</div>
	<div class="overflow-scroll custom-scrollbar">
	{#if selectedTab === 'plan'}
		<PlanSideBarTab onCalculatePath={onCalculatePath} />
	{:else}
		<RouteSideBarTab {selectedRouteStops} {pathPoints} />
	{/if}
	</div>


</aside>
