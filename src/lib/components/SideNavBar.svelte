<script lang="ts">
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
	<div class="custom-scrollbar flex-1 overflow-y-auto">
		<!-- Navigation Links -->
		<div class="flex flex-col">
			<a
				class="flex w-full items-center gap-4 border-b border-black bg-primary p-4 font-black text-black"
				href="/map"
			>
				<span class="material-symbols-outlined">route</span>
				<span class="font-headline text-sm font-bold uppercase">Route</span>
			</a>
			<a
				class="flex w-full items-center gap-4 border-b border-surface-variant p-4 text-white transition-none hover:bg-secondary hover:text-white"
				href="/map"
			>
				<span class="material-symbols-outlined">pin_drop</span>
				<span class="font-headline text-sm font-bold uppercase">Stops</span>
			</a>
		</div>
		<!-- Input Controls -->
		<div class="space-y-6 p-6">
			<!-- Location Inputs -->
			<div class="space-y-4">
				<div class="space-y-1">
					<label class="font-label text-xs font-bold tracking-widest text-primary uppercase"
						>Start Point</label
					>
					<div class="relative">
						<input
							class="w-full border-[3px] border-outline bg-surface-container-highest p-3 font-headline text-sm text-white outline-none focus:border-primary focus:ring-0"
							type="text"
							value="DETROIT, MI"
						/>
						<span class="material-symbols-outlined absolute top-3 right-3 text-outline"
							>my_location</span
						>
					</div>
				</div>
				<div class="space-y-1">
					<label class="font-label text-xs font-bold tracking-widest text-primary uppercase"
						>Destination</label
					>
					<div class="relative">
						<input
							class="w-full border-[3px] border-outline bg-surface-container-highest p-3 font-headline text-sm text-white outline-none focus:border-primary focus:ring-0"
							placeholder="ENTER CITY..."
							type="text"
						/>
						<span class="material-symbols-outlined absolute top-3 right-3 text-outline">flag</span>
					</div>
				</div>
			</div>
			<!-- Max Journey Deviation -->
			<div class="space-y-2 pt-2">
				<div class="flex items-center justify-between">
					<label class="font-label text-xs font-bold tracking-widest text-primary uppercase"
						>Max Deviation</label
					>
					<span class="font-headline text-xs font-bold text-primary">15 KM / 10 MIN</span>
				</div>
				<input
					class="w-full cursor-pointer accent-primary"
					max="60"
					min="5"
					type="range"
					value="15"
				/>
			</div>
			<!-- Individual Stop Configuration -->
			<div class="space-y-4 border-t border-surface-variant pt-4">
				<h3 class="font-headline text-sm font-black tracking-tighter text-primary uppercase">
					Individual Stop Config
				</h3>
				<!-- Stop 1 -->
				<div class="space-y-2 border-2 border-surface-variant bg-surface-container-low p-3">
					<div class="mb-1 flex items-center justify-between">
						<span class="font-label text-[10px] font-bold text-white uppercase opacity-70"
							>Stop 01</span
						>
						<span class="material-symbols-outlined text-[16px] text-primary">circle</span>
					</div>
					<div class="mb-2 space-y-1">
						<label
							class="font-label text-[9px] font-bold tracking-widest text-primary uppercase opacity-80"
							>At Journey Point</label
						>
						<div class="flex gap-1">
							<input
								class="w-full border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary focus:ring-0"
								type="number"
								value="50"
							/>
							<select
								class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
							>
								<option selected>KM</option>
								<option>HR</option>
							</select>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<select
							class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
						>
							<option>15 MIN</option>
							<option selected>30 MIN</option>
							<option>1 HR</option>
						</select>
						<select
							class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
						>
							<option selected>Restaurant</option>
							<option>Cafe</option>
							<option>Park</option>
							<option>Fuel</option>
						</select>
					</div>
				</div>
				<!-- Stop 2 -->
				<div class="space-y-2 border-2 border-surface-variant bg-surface-container-low p-3">
					<div class="mb-1 flex items-center justify-between">
						<span class="font-label text-[10px] font-bold text-white uppercase opacity-70"
							>Stop 02</span
						>
						<span class="material-symbols-outlined text-[16px] text-secondary">circle</span>
					</div>
					<div class="mb-2 space-y-1">
						<label
							class="font-label text-[9px] font-bold tracking-widest text-primary uppercase opacity-80"
							>At Journey Point</label
						>
						<div class="flex gap-1">
							<input
								class="w-full border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary focus:ring-0"
								type="number"
								value="50"
							/>
							<select
								class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
							>
								<option selected>KM</option>
								<option>HR</option>
							</select>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<select
							class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
						>
							<option>15 MIN</option>
							<option>30 MIN</option>
							<option>1 HR</option>
						</select>
						<select
							class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
						>
							<option>Restaurant</option>
							<option>Cafe</option>
							<option selected>Park</option>
							<option>Fuel</option>
						</select>
					</div>
				</div>
				<!-- Stop 3 -->
				<div class="space-y-2 border-2 border-surface-variant bg-surface-container-low p-3">
					<div class="mb-1 flex items-center justify-between">
						<span class="font-label text-[10px] font-bold text-white uppercase opacity-70"
							>Stop 03</span
						>
						<span class="material-symbols-outlined text-[16px] text-primary">circle</span>
					</div>
					<div class="mb-2 space-y-1">
						<label
							class="font-label text-[9px] font-bold tracking-widest text-primary uppercase opacity-80"
							>At Journey Point</label
						>
						<div class="flex gap-1">
							<input
								class="w-full border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary focus:ring-0"
								type="number"
								value="50"
							/>
							<select
								class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
							>
								<option selected>KM</option>
								<option>HR</option>
							</select>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<select
							class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
						>
							<option>15 MIN</option>
							<option>30 MIN</option>
							<option selected>1 HR</option>
						</select>
						<select
							class="appearance-none border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white uppercase outline-none focus:border-primary"
						>
							<option>Restaurant</option>
							<option>Cafe</option>
							<option>Park</option>
							<option selected>Fuel</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Sidebar Footer CTA -->
	<div class="border-t-[3px] border-primary bg-surface-container-highest p-6">
		<button
			class="group relative w-full border-[3px] border-black bg-primary py-4 font-headline text-lg font-black tracking-tighter text-black uppercase transition-transform active:translate-x-1 active:translate-y-1"
		>
			CALCULATE PATH
			<div class="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-black"></div>
		</button>
	</div>
</aside>
