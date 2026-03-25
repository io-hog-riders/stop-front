<script lang="ts">
</script>

<main class="relative mt-20 ml-80 h-[calc(100vh-4rem)] overflow-hidden p-8 ">
	<!-- Interactive Map Placeholder -->
	<div
		class="relative h-full w-full overflow-y-auto border-[3px] border-white bg-surface-container-low"
	>
		<img
			alt="A dark styled industrial map with vibrant neon route lines"
			class="h-full w-full object-cover opacity-60 brightness-50 grayscale"
			data-location="Chicago"
			src="https://lh3.googleusercontent.com/aida-public/AB6AXuALH3_9sxEfboULvd-vMEQFJYRseVdBTc4yAkh7l8o-tGb8gZ-ekwXtAeErHi78NT9azrr4M6zYXrsP24s1UUDXm6VNr1uIaAe-jsg4y8qCW7tY4HSzGcSurQh5YCehlHB0CNsgVN4ynplVzR9kqxsudQ7_S1sk5Y9eGHgHhR7mJqWiVI7iRZrykb50oEwPMcoHRPKkEbptLzB8oX7CuKsnsCrVoIl1uGEhj_rPmIOCMOgv6eZv034ZLIXq83_MdOupqjCfL-RB4pVx"
		/>
		<!-- Map Overlay UI Elements -->
		<div class="absolute top-6 left-6 space-y-4">
			<div
				class="inline-block border-[3px] border-secondary bg-black p-4 shadow-[8px_8px_0px_0px_var(--color-secondary)]"
			>
				<h3 class="font-headline text-2xl font-black tracking-tight text-secondary uppercase">
					Active Scan
				</h3>
				<p class="font-label text-sm text-white opacity-80">DETECTING OPTIMAL STOP NODES...</p>
			</div>
		</div>
		<div class="absolute right-6 bottom-6 flex flex-col gap-2">
			<button
				class="cursor-pointer border-[3px] border-white bg-black p-3 text-white transition-none hover:bg-white hover:text-black"
			>
				<span class="material-symbols-outlined">add</span>
			</button>
			<button
				class="cursor-pointer border-[3px] border-white bg-black p-3 text-white transition-none hover:bg-white hover:text-black"
			>
				<span class="material-symbols-outlined">remove</span>
			</button>
			<button class="cursor-pointer border-[3px] border-black bg-primary p-3 font-black text-black">
				<span class="material-symbols-outlined">layers</span>
			</button>
		</div>
		<!-- Route Info Overlay -->
		<div
			class="absolute top-6 right-6 w-72 border-[3px] border-primary bg-black p-6 shadow-[8px_8px_0px_0px_var(--color-primary)]"
		>
			<div class="mb-4 flex items-start justify-between">
				<span class="font-label text-xs font-bold tracking-widest text-primary uppercase"
					>Est. Trip Data</span
				>
				<span class="material-symbols-outlined text-primary">analytics</span>
			</div>
			<div class="space-y-4">
				<div>
					<p class="font-label text-[10px] text-on-surface-variant uppercase">Distance</p>
					<p class="font-headline text-3xl font-black text-white">
						428.5 <span class="text-lg">MI</span>
					</p>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="font-label text-[10px] text-on-surface-variant uppercase">Fuel Cost</p>
						<p class="font-headline text-xl font-bold text-white">$64.20</p>
					</div>
					<div>
						<p class="font-label text-[10px] text-on-surface-variant uppercase">Total Time</p>
						<p class="font-headline text-xl font-bold text-white">6h 12m</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Bottom Status Bar (Desktop) -->
	<div
		class="pointer-events-none absolute right-12 bottom-12 left-12 flex items-end justify-between"
	>
		<div class="pointer-events-auto border-[3px] border-white bg-black p-2 px-4">
			<span class="font-label text-xs font-bold text-white uppercase"
				>Coords: 41.8781° N, 87.6298° W</span
			>
		</div>
	</div>
</main>
