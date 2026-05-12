<script lang="ts">
	import type { StopType } from '$lib/types/mapTypes';

	type Props = {
		index: string;
		targetPercent: number;
		stopType: StopType;
		onRemove?: () => void;
		onTargetPercentChange?: (value: number) => void;
		onStopTypeChange?: (value: StopType) => void;
	};

	let {
		index,
		targetPercent,
		stopType,
		onRemove,
		onTargetPercentChange,
		onStopTypeChange
	}: Props = $props();

	function handleTargetPercentInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onTargetPercentChange?.(Number(target.value));
	}

	function handleStopTypeInput(event: Event) {
		const target = event.target as HTMLSelectElement;
		onStopTypeChange?.(target.value as StopType);
	}
</script>

<div
	class="
		space-y-2
		border-2
		border-surface-variant
		bg-surface-container-low
		p-3

		**:text-white
		**:uppercase

		[&_input]:w-full
		[&_input]:focus:ring-0
		[&_input,select]:border-2
		[&_input,select]:border-outline
		[&_input,select]:bg-black
		[&_input,select]:p-1.5
		[&_input,select]:font-headline
		[&_input,select]:text-[10px]

		[&_input,select]:outline-none
		[&_input,select]:focus:border-primary

		[&_select]:appearance-none
	"
>
	<!-- Title -->
	<div class="mb-1 flex items-center justify-between">
		<span class="font-label text-[10px] font-bold opacity-70">
			Stop {index}
		</span>
		<button
			type="button"
			onclick={onRemove}
			aria-label="Remove stop"
			class="font-label text-[12px] font-bold text-primary uppercase hover:text-white"
		>
			X
		</button>
	</div>

	<!-- First row: when to stop? -->
	<div class="mb-2 space-y-2">
		<div class="flex items-center justify-between">
			<p class="font-label text-[9px] font-bold tracking-widest text-primary opacity-80">
				Target Route Position
			</p>
			<span class="font-headline text-[10px] font-bold text-white tabular-nums"
				>{targetPercent}%</span
			>
		</div>
		<input
			name="targetPercent"
			type="range"
			min="1"
			max="100"
			value={targetPercent}
			oninput={handleTargetPercentInput}
			class="w-full"
		/>
	</div>

	<!-- Second row: what type? -->
	<select
		name="stopType"
		bind:value={stopType}
		oninput={handleStopTypeInput}
		class="w-full"
	>
		<option value="restaurant">Restaurant</option>
		<option value="gas_station">Gas station</option>
		<option value="hotel">Hotel</option>
		<option value="rest_area">Rest area</option>
		<option value="charging_station">Charging station</option>
		<option value="attraction">Attraction</option>
		<option value="parking">Parking</option>
		<option value="hospital">Hospital</option>
	</select>
</div>
