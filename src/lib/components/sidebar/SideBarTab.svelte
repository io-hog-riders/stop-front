<script lang="ts">
	let { title, symbol, href, selected = false } = $props()
</script>

<a
	class="
		flex
		w-full
		items-center
		gap-4
		border-b
		p-4
		{selected ? 'border-black bg-primary font-black text-black'
		: 'border-surface-variant text-white transition-none hover:bg-secondary hover:text-white'}
	"
	{href}
>
	<span class="material-symbols-outlined">{symbol}</span>
	<span class="font-headline text-sm font-bold uppercase">{title}</span>
</a>
