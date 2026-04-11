<script lang="ts">
	/* this is the sidebar tab for the planning mode, which allows the user
	to choose the start/end points and intended stop count
	 */
	import StopConfigEntry from '$lib/components/sidebar/StopConfigEntry.svelte';
	import LocationEntry from '$lib/components/sidebar/LocationEntry.svelte';

	type Props = {
		onCalculatePath?: () => void | Promise<void>;
	};

	let { onCalculatePath }: Props = $props();
</script>


<div>
	<!-- Input Controls -->
	<div class="space-y-6 p-6">
		<!-- Location Inputs -->
		<div class="space-y-4">
			<LocationEntry label="Start point" value="Kraków, PL" />
			<LocationEntry label="Destination" symbol="flag" />
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
			<StopConfigEntry index="01" stop_time='30 MIN' stop_type='Restaurant' />
			<StopConfigEntry index="02" stop_time='15 MIN' stop_type='Park' />
			<StopConfigEntry index="03" stop_time='1 HR' stop_type='Fuel' />
		</div>
	</div>
	<!-- Sidebar Footer CTA -->
	<div class="border-t-[3px] border-primary bg-surface-container-highest p-6">
		<button
			class="group relative w-full border-[3px] border-black bg-primary py-4 font-headline text-lg font-black tracking-tighter text-black uppercase transition-transform active:translate-x-1 active:translate-y-1"
			onclick={() => onCalculatePath?.()}
		>
			CALCULATE PATH
			<div class="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-black"></div>
		</button>
	</div>
</div>