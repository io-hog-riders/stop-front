<script lang="ts">
	import { usagePreference } from '$lib/stores/usagePreference.svelte';
	import UsageTypeModal from './UsageTypeModal.svelte';

	let usageModalOpen = $state(false);
	let activeMeta = $derived(usagePreference.meta());
</script>

<header
	class="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b-[3px] border-primary bg-[#0e0e0e] px-6"
>
	<div class="flex items-center gap-8">
		<span
			class="font-headline text-3xl font-black tracking-tighter text-primary uppercase italic"
			>STOPFINDER</span
		>
		<nav class="hidden h-full items-center gap-6 md:flex">
			<a
				class="flex h-full items-center border-b-4 border-primary px-2 font-headline tracking-tighter text-primary uppercase"
				href="/map">PLANNER</a
			>
		</nav>
	</div>
	<div class="flex items-center gap-4">
		<button
			type="button"
			onclick={() => (usageModalOpen = true)}
			class="flex items-center gap-2 border-[3px] border-primary bg-[#0e0e0e] px-3 py-2 font-headline text-xs font-black tracking-wider text-primary uppercase transition-none hover:bg-primary hover:text-black"
			aria-label="Change usage type"
		>
			<span class="material-symbols-outlined text-base">
				{activeMeta?.icon ?? 'tune'}
			</span>
			<span class="hidden sm:inline">
				{activeMeta ? activeMeta.title : 'Set Usage'}
			</span>
		</button>
	</div>
</header>

<UsageTypeModal bind:open={usageModalOpen} />
