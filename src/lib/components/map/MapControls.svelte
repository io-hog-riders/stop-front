<script lang="ts">
	let { onZoomIn, onZoomOut } = $props<{ onZoomIn: () => void; onZoomOut: () => void }>();
</script>

<div class="absolute right-6 bottom-6 flex flex-col gap-2">
	<button
		onclick={onZoomIn}
		class="cursor-pointer border-[3px] border-white bg-black p-3 text-white transition-none hover:bg-white hover:text-black"
	>
		<span class="material-symbols-outlined">add</span>
	</button>
	<button
		onclick={onZoomOut}
		class="cursor-pointer border-[3px] border-white bg-black p-3 text-white transition-none hover:bg-white hover:text-black"
	>
		<span class="material-symbols-outlined">remove</span>
	</button>
	<button class="cursor-pointer border-[3px] border-black bg-primary p-3 font-black text-black">
		<span class="material-symbols-outlined">layers</span>
	</button>
</div>
