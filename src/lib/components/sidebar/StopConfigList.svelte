<script lang="ts">
	import StopConfigEntry from '$lib/components/sidebar/StopConfigEntry.svelte';
	import type { StopConfig, StopType } from '$lib/types/mapTypes';

	type Props = {
		stopConfigs?: StopConfig[];
	};

	let { stopConfigs = $bindable<StopConfig[]>([]) }: Props = $props();

	function createStopConfig(): StopConfig {
		return {
			id: `cfg-${Math.random().toString(36).substr(2, 9)}`,
			targetPercent: 50,
			stopDurationMinutes: 30,
			stopType: 'Restaurant'
		};
	}

	function addStopConfig() {
		stopConfigs = [...stopConfigs, createStopConfig()];
	}

	function removeStopConfig(id: string) {
		stopConfigs = stopConfigs.filter((config) => config.id !== id);
	}

	function updateStopConfigPercent(id: string, value: number) {
		const normalizedPercent = Math.min(100, Math.max(1, Math.round(value || 1)));
		stopConfigs = stopConfigs.map((config) =>
			config.id === id ? { ...config, targetPercent: normalizedPercent } : config
		);
	}

	function updateStopConfigDuration(id: string, value: number) {
		const normalizedDuration = Math.min(240, Math.max(5, Math.round(value || 5)));
		stopConfigs = stopConfigs.map((config) =>
			config.id === id ? { ...config, stopDurationMinutes: normalizedDuration } : config
		);
	}

	function updateStopConfigType(id: string, value: StopType) {
		stopConfigs = stopConfigs.map((config) =>
			config.id === id ? { ...config, stopType: value } : config
		);
	}
</script>

<div class="space-y-4 border-t border-surface-variant pt-4">
	<div class="flex items-center justify-between">
		<h3 class="font-headline text-sm font-black tracking-tighter text-primary uppercase">
			Individual Stop Config
		</h3>
		<button
			type="button"
			onclick={addStopConfig}
			class="border-2 border-primary px-2 py-1 font-label text-[10px] font-bold text-primary uppercase hover:bg-primary hover:text-black"
		>
			Add Stop
		</button>
	</div>

	{#if stopConfigs.length === 0}
		<p class="font-label text-xs text-on-surface-variant uppercase">
			No configured stops yet. Add one to search along the route.
		</p>
	{/if}

	{#each stopConfigs as config, idx (config.id)}
		<StopConfigEntry
			index={(idx + 1).toString().padStart(2, '0')}
			targetPercent={config.targetPercent}
			stopDurationMinutes={config.stopDurationMinutes}
			stopType={config.stopType}
			onRemove={() => removeStopConfig(config.id)}
			onTargetPercentChange={(value) => updateStopConfigPercent(config.id, value)}
			onStopDurationMinutesChange={(value) => updateStopConfigDuration(config.id, value)}
			onStopTypeChange={(value) => updateStopConfigType(config.id, value)}
		/>
	{/each}
</div>
