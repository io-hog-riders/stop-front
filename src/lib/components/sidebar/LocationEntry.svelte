<script lang="ts">
	type Props = {
		label: string;
		value?: string;
		symbol?: string;
		onBlurAction?: () => void | Promise<void>;
		onInputAction?: () => void;
	};

	let {
		label,
		value = $bindable(''),
		symbol = 'my_location',
		onBlurAction,
		onInputAction
	}: Props = $props();
</script>

<div class="space-y-1">
	<label class="font-label text-xs font-bold tracking-widest text-primary uppercase">
		{label}
	</label>

	<div class="relative">
		<input
			class="
				w-full
				border-[3px]
				border-outline
				bg-surface-container-highest
				p-3
				font-headline
				text-sm
				text-white
				uppercase
				outline-none
				focus:border-primary
				focus:ring-0
			"
			type="text"
			bind:value
			onblur={onBlurAction}
			oninput={onInputAction}
			placeholder="Enter location…"
		/>

		<span class="material-symbols-outlined absolute top-3 right-3 text-outline">
			{symbol}
		</span>
	</div>
</div>
