<script lang="ts">
	let { currentStep } = $props<{ currentStep: number }>();

	const navItems = [
		{ step: 1, icon: 'person', label: 'IDENTITY', index: '01' },
		{ step: 2, icon: 'directions_car', label: 'VEHICLE', index: '02' },
		{ step: 3, icon: 'explore', label: 'EXPERIENCE', index: '03' },
		{ step: 4, icon: 'badge', label: 'ACCOUNT', index: '04' }
	];
</script>

<aside
	class="fixed top-0 left-0 z-40 hidden h-full w-64 flex-col border-r-[3px] border-primary bg-[#0e0e0e] pt-20 font-headline font-bold uppercase md:flex"
>
	<div class="mb-6 border-b-[3px] border-primary px-6 py-4">
		<p class="mb-1 text-[10px] tracking-[0.2em] text-white opacity-60">PHASE_01</p>
		<h2 class="text-xl font-black text-primary">ONBOARDING</h2>
	</div>
	<nav class="flex flex-grow flex-col">
		{#each navItems as item (item.step)}
			<div
				class="flex items-center gap-4 border-b-[3px] p-4 transition-all
					{currentStep === item.step
					? 'border-black bg-primary font-black text-black'
					: 'border-primary text-white hover:bg-surface-variant hover:text-primary'}"
			>
				<span
					class="material-symbols-outlined"
					style={`font-variation-settings: 'FILL' ${currentStep === item.step ? 1 : 0}`}
				>
					{item.icon}
				</span>
				<span>{item.label}</span>
			</div>
		{/each}
	</nav>
</aside>
