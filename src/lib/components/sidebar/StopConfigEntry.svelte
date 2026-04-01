<script lang="ts">
	let {
		index,
		journey_point = $bindable(50),
		journey_point_unit = $bindable('KM'),
		stop_time = $bindable('30 MIN'),
		stop_type = $bindable('Restaurant'),
	} = $props();
</script>

<div
	class="
		space-y-2
		border-2
		border-surface-variant
		bg-surface-container-low
		p-3

		**:uppercase
		**:text-white

		[&_input,select]:border-2
		[&_input,select]:border-outline
		[&_input,select]:bg-black
		[&_input,select]:p-1.5
		[&_input,select]:font-headline
		[&_input,select]:text-[10px]
		[&_input,select]:outline-none
		[&_input,select]:focus:border-primary

		[&_input]:w-full
		[&_input]:focus:ring-0

		[&_select]:appearance-none
	"
>
	<!-- Title -->
	<div class="mb-1 flex items-center justify-between">
		<span class="font-label text-[10px] font-bold opacity-70">
			Stop {index}
		</span>
		<span class="material-symbols-outlined text-[16px] text-primary">
			circle
		</span>
	</div>

	<!-- First row: when to stop? -->
	<div class="mb-2 space-y-1">
		<label class="font-label text-[9px] font-bold tracking-widest text-primary opacity-80">
			At Journey Point
		</label>
		<div class="flex gap-1">
			<input type="number" bind:value={journey_point} />
			<select bind:value={journey_point_unit}>
				<option>KM</option>
				<option>HR</option>
			</select>
		</div>
	</div>

	<!-- Second row: how to stop? -->
	<div class="grid grid-cols-2 gap-2">
		<select bind:value={stop_time}>
			<option>15 MIN</option>
			<option>30 MIN</option>
			<option>1 HR</option>
		</select>
		<select bind:value={stop_type}>
			<option>Restaurant</option>
			<option>Cafe</option>
			<option>Park</option>
			<option>Fuel</option>
		</select>
	</div>
</div>
