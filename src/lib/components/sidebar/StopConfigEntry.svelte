<script lang="ts">
	import type { StopType } from '$lib/types/mapTypes';

	type Props = {
		index: string;
		targetPercent: number;
		stopDurationMinutes: number;
		stopType: StopType;
		onRemove?: () => void;
		onTargetPercentChange?: (value: number) => void;
		onStopDurationMinutesChange?: (value: number) => void;
		onStopTypeChange?: (value: StopType) => void;
	};

	let {
		index,
		targetPercent,
		stopDurationMinutes,
		stopType,
		onRemove,
		onTargetPercentChange,
		onStopDurationMinutesChange,
		onStopTypeChange
	}: Props = $props();

	function handleTargetPercentInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onTargetPercentChange?.(Number(target.value));
	}

	function handleStopDurationInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onStopDurationMinutesChange?.(Number(target.value));
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
			class="font-label text-[10px] font-bold text-primary uppercase hover:text-white"
		>
			Remove
		</button>
	</div>

	<!-- First row: when to stop? -->
	<div class="mb-2 space-y-1">
		<p class="font-label text-[9px] font-bold tracking-widest text-primary opacity-80">
			Target Route Position
		</p>
		<div class="flex gap-1">
			<input
				name="targetPercent"
				type="number"
				min="1"
				max="100"
				value={targetPercent}
				oninput={handleTargetPercentInput}
			/>
			<div
				class="flex min-w-16 items-center justify-center border-2 border-outline bg-black p-1.5 font-headline text-[10px] text-white"
			>
				%
			</div>
		</div>
	</div>

	<!-- Second row: how to stop? -->
	<div class="grid grid-cols-2 gap-2">
		<input
			name="stopDurationMinutes"
			aria-label="Stop duration in minutes"
			type="number"
			min="5"
			max="240"
			step="5"
			value={stopDurationMinutes}
			oninput={handleStopDurationInput}
		/>
		<select name="stopType" bind:value={stopType} oninput={handleStopTypeInput}>
			<option>Restaurant</option>
			<option>Cafe</option>
			<option>Park</option>
			<option>Fuel</option>
		</select>
	</div>
	<p class="font-label text-[9px] tracking-widest text-on-surface-variant uppercase">
		Duration in minutes
	</p>
</div>
