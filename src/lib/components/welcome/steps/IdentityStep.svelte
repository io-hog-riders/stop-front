<div class="mb-12">
	<h1 class="mb-2 text-4xl font-black tracking-tighter text-white uppercase md:text-6xl">
		WELCOME <span class="text-primary">PILOT</span>.
	</h1>
	<p class="font-label text-sm font-bold tracking-widest text-secondary uppercase">
		System Initialization // Step 01
	</p>
</div>

<section class="relative mb-12 overflow-hidden border-4 border-white bg-surface-variant p-8">
	<h2 class="mb-8 max-w-2xl text-2xl leading-tight font-black text-white uppercase md:text-4xl">
		How do you plan to use <span class="bg-primary px-2 text-black">StopFinder</span>?
	</h2>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each [{ icon: 'person', title: 'Individual Driver', desc: 'Optimized routes for solo highway runs.', type: 'TYPE_01' }, { icon: 'family_restroom', title: 'Family Trip', desc: 'Priority on amenities, safety, and rest stops.', type: 'TYPE_02' }, { icon: 'local_shipping', title: 'Professional Driver', desc: 'HOS compliance and heavy-duty logistics.', type: 'TYPE_03' }, { icon: 'group', title: 'Group of Friends', desc: 'Multi-stop coordination and social venues.', type: 'TYPE_04' }] as opt}
			<button
				class="group relative border-4 border-surface-variant bg-[#0e0e0e] p-6 text-left transition-all hover:translate-x-1 hover:translate-y-1 hover:border-primary hover:shadow-[8px_8px_0px_0px_var(--color-primary)] active:scale-95"
			>
				<div class="mb-4 flex items-start justify-between">
					<span class="material-symbols-outlined text-4xl text-secondary group-hover:text-primary">
						{opt.icon}
					</span>
					<div class="font-mono text-[10px] text-outline">{opt.type}</div>
				</div>
				<div class="text-xl font-black text-white uppercase group-hover:text-primary">
					{opt.title}
				</div>
				<p class="mt-2 font-label text-xs text-on-surface-variant uppercase">{opt.desc}</p>
			</button>
		{/each}
	</div>
</section>

<div
	class="grid grid-cols-2 gap-px border-4 border-surface-variant bg-surface-variant md:grid-cols-4"
>
	<div class="bg-black p-4">
		<div class="font-label text-[10px] font-bold text-secondary uppercase">Lat/Long</div>
		<div class="font-mono text-sm text-white">40.7128° N, 74.0060° W</div>
	</div>
	<div class="bg-black p-4">
		<div class="font-label text-[10px] font-bold text-secondary uppercase">Status</div>
		<div class="font-mono text-sm text-primary">STANDBY_READY</div>
	</div>
</div>
