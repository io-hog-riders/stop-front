<div class="mb-12">
	<h1
		class="mb-2 font-headline text-5xl font-black tracking-tight text-white uppercase italic md:text-7xl"
	>
		Driver <span class="text-primary">Experience</span>
	</h1>
	<p class="font-label text-lg tracking-widest text-[#adaaaa] uppercase">
		Define your friction levels and operational radius.
	</p>
</div>

<div class="grid grid-cols-1 gap-8 md:grid-cols-12">
	<section class="md:col-span-12">
		<h3 class="mb-6 flex items-center gap-3 font-headline text-2xl font-black uppercase">
			<span class="bg-primary px-2 py-1 text-black">01</span> Mastery Level
		</h3>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
			<div
				class="group relative cursor-pointer border-[3px] border-white bg-surface-variant p-6 transition-all hover:bg-white hover:text-black"
			>
				<span class="material-symbols-outlined mb-4 text-4xl">child_care</span>
				<h4 class="mb-2 font-headline text-xl font-black uppercase">Beginner</h4>
				<p class="font-label text-sm opacity-70">
					New to the asphalt. Prioritizing safety and clear guidance.
				</p>
			</div>
			<div
				class="group neobrutal-shadow relative cursor-pointer border-[3px] border-black bg-primary p-6 text-black shadow-[6px_6px_0px_0px_var(--color-primary)] transition-all"
			>
				<span class="material-symbols-outlined mb-4 text-4xl text-black">verified</span>
				<h4 class="mb-2 font-headline text-xl font-black uppercase">Experienced</h4>
				<p class="font-label text-sm font-bold opacity-80">
					Thousands of miles logged. Efficient routing expected.
				</p>
			</div>
			<div
				class="group relative cursor-pointer border-[3px] border-white bg-surface-variant p-6 transition-all hover:bg-white hover:text-black"
			>
				<span class="material-symbols-outlined mb-4 text-4xl">military_tech</span>
				<h4 class="mb-2 font-headline text-xl font-black uppercase">Professional</h4>
				<p class="font-label text-sm opacity-70">
					Precision operator. Logistics and uptime are the only metrics.
				</p>
			</div>
		</div>
	</section>

	<section class="md:col-span-5">
		<h3 class="mb-6 flex items-center gap-3 font-headline text-2xl font-black uppercase">
			<span class="bg-primary px-2 py-1 text-black">02</span> Operation Radius
		</h3>
		<div class="flex flex-col gap-4">
			<label
				class="group flex cursor-pointer items-center justify-between border-[3px] border-white bg-surface-container-high p-5 transition-all hover:bg-white hover:text-black"
			>
				<div class="flex items-center gap-4">
					<span class="material-symbols-outlined">location_on</span>
					<span class="font-headline font-bold uppercase">Domestic</span>
				</div>
				<input
					type="radio"
					name="radius"
					class="h-6 w-6 rounded-none border-2 border-black checked:bg-black"
					checked
				/>
			</label>
			<label
				class="group flex cursor-pointer items-center justify-between border-[3px] border-white bg-surface-container-high p-5 transition-all hover:bg-white hover:text-black"
			>
				<div class="flex items-center gap-4">
					<span class="material-symbols-outlined">public</span>
					<span class="font-headline font-bold uppercase">International</span>
				</div>
				<input
					type="radio"
					name="radius"
					class="h-6 w-6 rounded-none border-2 border-black checked:bg-black"
				/>
			</label>
		</div>
	</section>

	<section class="md:col-span-7">
		<h3 class="mb-6 flex items-center gap-3 font-headline text-2xl font-black uppercase">
			<span class="bg-primary px-2 py-1 text-black">03</span> Surface Preference
		</h3>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each [{ icon: 'add_road', title: 'Highways', desc: 'High-speed, multi-lane corridors.', active: false }, { icon: 'landscape', title: 'Scenic routes', desc: 'Visual focus and winding paths.', active: true }, { icon: 'terrain', title: 'Off-road', desc: 'Unpaved technical challenges.', active: false }, { icon: 'alt_route', title: 'Urban Bypass', desc: 'City navigation and shortcutting.', active: false }] as opt (opt.title)}
				<div
					class="group flex cursor-pointer items-start gap-4 border-[3px] bg-surface p-4 transition-colors {opt.active
						? 'neobrutal-shadow border-primary shadow-[6px_6px_0px_0px_var(--color-primary)]'
						: 'border-outline hover:border-primary'}"
				>
					<span
						class="material-symbols-outlined text-3xl {opt.active
							? 'text-primary'
							: 'group-hover:text-primary'}">{opt.icon}</span
					>
					<div>
						<h5 class="font-headline text-sm font-bold uppercase">{opt.title}</h5>
						<p class="font-label text-[10px] {opt.active ? 'text-primary' : 'opacity-60'}">
							{opt.desc}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
