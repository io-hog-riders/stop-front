<script lang="ts">
	type Props = {
		title: string;
		symbol: string;
		selected?: boolean;
		onClick?: () => void;
	};

	let { title, symbol, selected = false, onClick }: Props = $props();
</script>

<button
	type="button"
	onclick={onClick}
	class="
		flex
		w-full
		items-center
		gap-4
		border-b
		p-4
		text-left
		{selected
		? 'border-black bg-primary font-black text-black'
		: 'border-surface-variant text-white transition-none hover:bg-surface-container-highest hover:text-white'}
	"
>
	<span class="material-symbols-outlined">{symbol}</span>
	<span class="font-headline text-sm font-bold uppercase">{title}</span>
</button>
