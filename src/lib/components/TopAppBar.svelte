<script lang="ts">
	// TopAppBar for the application
</script>

<header
	class="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b-[3px] border-primary bg-[#0e0e0e] px-6"
>
	<div class="flex items-center gap-8">
		<span class="font-headline text-3xl font-black tracking-tighter text-primary uppercase italic"
			>STOPFINDER</span
		>
		<nav class="hidden h-full items-center gap-6 md:flex">
			<a
				class="flex h-full items-center border-b-4 border-primary px-2 font-headline tracking-tighter text-primary uppercase"
				href="/map">PLANNER</a
			>
			<a
				class="flex h-full items-center px-2 font-headline tracking-tighter text-white uppercase transition-none hover:bg-primary hover:text-black"
				href="/map">HISTORY</a
			>
			<a
				class="flex h-full items-center px-2 font-headline tracking-tighter text-white uppercase transition-none hover:bg-primary hover:text-black"
				href="/map">FLEET</a
			>
		</nav>
	</div>
	<div class="flex items-center gap-4">
		<button class="p-2 text-white transition-none hover:bg-primary hover:text-black">
			<span class="material-symbols-outlined">search</span>
		</button>
		<button class="p-2 text-white transition-none hover:bg-primary hover:text-black">
			<span class="material-symbols-outlined">account_circle</span>
		</button>
		<button class="p-2 text-white transition-none hover:bg-primary hover:text-black">
			<span class="material-symbols-outlined">settings</span>
		</button>
	</div>
</header>
