<script lang="ts">
	type Props = {
		title: string;
		symbol: string;
		href?: string;
		selected?: boolean;
		onClick?: () => void;
	};

	let { title, symbol, href = '#', selected = false, onClick }: Props = $props();

	function handleClick(event: MouseEvent) {
		if (!onClick) {
			return;
		}

		event.preventDefault();
		onClick();
	}
</script>

<a
	class="
		flex
		w-full
		items-center
		gap-4
		border-b
		p-4
		{selected
		? 'border-black bg-primary font-black text-black'
		: 'border-surface-variant text-white transition-none hover:bg-surface-container-highest hover:text-white'}
	"
	{href}
	onclick={handleClick}
>
	<span class="material-symbols-outlined">{symbol}</span>
	<span class="font-headline text-sm font-bold uppercase">{title}</span>
</a>
