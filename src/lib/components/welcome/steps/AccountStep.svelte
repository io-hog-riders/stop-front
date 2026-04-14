<div class="mb-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
	<div
		class="relative border-[3px] border-primary bg-surface-variant p-8 shadow-[6px_6px_0px_0px_var(--color-primary)] lg:col-span-7"
	>
		<header class="mb-10">
			<span
				class="mb-4 inline-block bg-primary px-2 py-1 text-xs font-black tracking-widest text-black uppercase"
			>
				Step 04 / Final
			</span>
			<h1
				class="mb-4 font-headline text-5xl leading-none font-black tracking-tighter uppercase italic md:text-7xl"
			>
				Create <br /> <span class="text-primary">Account</span>
			</h1>
			<p class="max-w-md font-label text-[#adaaaa]">
				Secure your identity on the asphalt. Your credentials grant access to the global
				haulage network.
			</p>
		</header>
		<form class="space-y-6" onsubmit={(e) => e.preventDefault()}>
			<div class="space-y-2">
				<label class="font-label text-xs font-bold tracking-widest text-primary uppercase"
					>Full Name</label
				>
				<input
					type="text"
					class="w-full border-[3px] border-outline bg-[#0e0e0e] p-4 font-black text-white uppercase focus:border-primary focus:ring-0"
					placeholder="ELARA VANCE"
				/>
			</div>
			<div class="space-y-2">
				<label class="font-label text-xs font-bold tracking-widest text-primary uppercase"
					>Network Email</label
				>
				<input
					type="email"
					class="w-full border-[3px] border-outline bg-[#0e0e0e] p-4 font-black text-white uppercase focus:border-primary focus:ring-0"
					placeholder="OPERATOR@STOPFINDER.IO"
				/>
			</div>
			<div class="space-y-2">
				<label class="font-label text-xs font-bold tracking-widest text-primary uppercase"
					>Access Key (Password)</label
				>
				<input
					type="password"
					class="w-full border-[3px] border-outline bg-[#0e0e0e] p-4 font-black text-white uppercase focus:border-primary focus:ring-0"
					placeholder="••••••••••••"
				/>
			</div>
		</form>
	</div>

	<div class="flex flex-col gap-8 lg:col-span-5">
		<div
			class="neobrutal-shadow relative border-[3px] border-black bg-secondary p-1 shadow-[6px_6px_0px_0px_var(--color-primary)]"
		>
			<div
				class="relative flex aspect-square items-center justify-center overflow-hidden bg-black"
			>
				<div
					class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"
				></div>
				<div class="z-10 p-8 text-center">
					<span
						class="material-symbols-outlined mb-4 block text-9xl leading-none text-primary"
						style="font-variation-settings: 'FILL' 1"
					>
						local_shipping
					</span>
					<div
						class="inline-block rotate-[-2deg] bg-primary px-4 py-2 text-xl font-black text-black"
					>
						VERIFIED OPERATOR
					</div>
				</div>
			</div>
		</div>

		<div class="border-[3px] border-white bg-surface p-6">
			<h3 class="mb-4 flex items-center gap-2 font-black text-white uppercase">
				<span class="material-symbols-outlined text-secondary">verified_user</span>
				Security Protocol
			</h3>
			<ul class="space-y-3 font-label text-sm text-[#adaaaa]">
				<li class="flex items-start gap-3 border-b border-outline-variant pb-2">
					<span class="font-bold text-primary">01</span>
					<span>End-to-end encryption on all haulage logs.</span>
				</li>
				<li class="flex items-start gap-3 border-b border-outline-variant pb-2">
					<span class="font-bold text-primary">02</span>
					<span>Biometric link to vehicle ignition systems.</span>
				</li>
			</ul>
		</div>
	</div>
</div>
