<script lang="ts">
	import TopAppBar from '$lib/components/TopAppBar.svelte';
	import SideNavBar from '$lib/components/SideNavBar.svelte';
	import InteractiveMap from '$lib/components/InteractiveMap.svelte';
	import MobileNavigation from '$lib/components/MobileNavigation.svelte';
</script>

<svelte:head>
	<title>STOPFINDER - Planner</title>
</svelte:head>

<div class="relative h-screen w-full">
	<TopAppBar />
	<SideNavBar />
	<InteractiveMap />
	<MobileNavigation />
</div>
