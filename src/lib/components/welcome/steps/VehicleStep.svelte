<script lang="ts">
	let engine = $state('Gas');
	let capacity = $state(60);
	let consumption = $state(8.5);

	let estRange = $derived(
		capacity && consumption && consumption > 0 ? Math.round((capacity / consumption) * 100) : 0
	);
</script>

<div class="mb-12">
	<span
		class="mb-4 inline-block bg-secondary-dim px-3 py-1 font-headline text-sm font-black text-black uppercase"
		>Configuration Mode</span
	>
	<h1 class="mb-6 text-6xl leading-none font-black tracking-tighter uppercase md:text-8xl">
		Vehicle <span class="text-primary">Specs</span>
	</h1>
	<p class="max-w-xl font-headline text-lg text-white/70">
		Define your hardware parameters. Consumption and capacity directly impact route calculation and
		pit stop frequency.
	</p>
</div>

<form class="space-y-12" onsubmit={(e) => e.preventDefault()}>
	<section>
		<h3 class="mb-6 flex items-center gap-2 text-xl font-black uppercase">
			<span class="h-8 w-2 bg-primary"></span>
			01. Power Plant Selection
		</h3>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each [{ id: 'Gas', icon: 'local_gas_station' }, { id: 'Diesel', icon: 'oil_barrel' }, { id: 'Electric', icon: 'electric_car' }, { id: 'Hybrid', icon: 'bolt' }] as type (type.id)}
				<label class="group relative cursor-pointer">
					<input
						type="radio"
						name="engine"
						class="peer hidden"
						value={type.id}
						bind:group={engine}
					/>
					<div
						class="flex h-32 flex-col justify-between border-[3px] border-white bg-[#0e0e0e] p-4 transition-all peer-checked:border-black peer-checked:bg-primary peer-checked:text-black peer-checked:shadow-[6px_6px_0px_0px_white] hover:bg-surface-variant active:translate-x-1 active:translate-y-1 active:shadow-none"
					>
						<span class="material-symbols-outlined text-3xl">{type.icon}</span>
						<span class="text-lg leading-tight font-black uppercase">{type.id}</span>
					</div>
				</label>
			{/each}
		</div>
	</section>

	<section class="grid gap-8 md:grid-cols-2">
		<div class="space-y-4">
			<h3 class="flex items-center gap-2 text-xl font-black uppercase">
				<span class="h-8 w-2 bg-secondary-dim"></span>
				02. Tank Capacity
			</h3>
			<div class="group relative">
				<div
					class="absolute -right-2 -bottom-2 -z-10 h-full w-full border-[3px] border-primary transition-transform group-focus-within:translate-x-1 group-focus-within:translate-y-1"
				></div>
				<div
					class="relative z-0 flex items-end gap-4 border-[3px] border-white bg-surface-variant p-6"
				>
					<input
						type="number"
						bind:value={capacity}
						class="w-full border-none bg-transparent p-0 text-5xl font-black text-primary placeholder:text-white/20 focus:ring-0"
						placeholder="00.0"
					/>
					<span class="mb-2 font-headline text-xl font-black uppercase">Liters</span>
				</div>
			</div>
		</div>
		<div class="space-y-4">
			<h3 class="flex items-center gap-2 text-xl font-black uppercase">
				<span class="h-8 w-2 bg-secondary-dim"></span>
				03. Consumption Rate
			</h3>
			<div class="group relative">
				<div
					class="absolute -right-2 -bottom-2 -z-10 h-full w-full border-[3px] border-primary transition-transform group-focus-within:translate-x-1 group-focus-within:translate-y-1"
				></div>
				<div
					class="relative z-0 flex items-end gap-4 border-[3px] border-white bg-surface-variant p-6"
				>
					<input
						type="number"
						bind:value={consumption}
						class="w-full border-none bg-transparent p-0 text-5xl font-black text-primary placeholder:text-white/20 focus:ring-0"
						placeholder="0.0"
					/>
					<span class="mb-2 font-headline text-xl font-black uppercase">L / 100km</span>
				</div>
			</div>
		</div>
	</section>

	<div
		class="group relative flex flex-col items-center gap-8 overflow-hidden border-[3px] border-secondary-dim bg-surface p-8 md:flex-row"
	>
		<div
			class="flex h-24 w-24 shrink-0 items-center justify-center border-[3px] border-black bg-secondary-dim shadow-[4px_4px_0px_0px_var(--color-primary)]"
		>
			<span
				class="material-symbols-outlined text-5xl text-black"
				style="font-variation-settings: 'FILL' 1">analytics</span
			>
		</div>
		<div>
			<h4 class="text-3xl leading-tight font-black uppercase italic">Dynamic Range Analysis</h4>
			<p class="mt-2 font-headline text-sm tracking-wide text-white/60 uppercase">
				Calculated based on current asphalt temperature and friction coefficients.
			</p>
		</div>
		<div class="ml-auto flex items-center gap-4 border-l-[3px] border-white/20 pl-8">
			<div class="text-right">
				<div class="mb-1 text-xs font-black text-white/50 uppercase">Est. Range</div>
				<div class="text-5xl font-black tracking-tighter text-secondary-dim">{estRange}KM</div>
			</div>
		</div>
	</div>
</form>
