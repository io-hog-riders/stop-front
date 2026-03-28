<script lang="ts">
	let {
		onBack,
		onContinue,
		continueLabel = 'Continue',
		showBack = true
	} = $props<{
		onBack?: () => void;
		onContinue: () => void;
		continueLabel?: string;
		showBack?: boolean;
	}>();
</script>

<footer
	class="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t-[4px] border-primary bg-[#0e0e0e] px-10 py-6 font-headline font-black uppercase"
>
	<div>
		{#if showBack && onBack}
			<button
				onclick={onBack}
				class="flex items-center gap-2 border-[3px] border-primary bg-[#0e0e0e] px-8 py-4 text-primary transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_var(--color-primary)] active:translate-x-1 active:translate-y-1 active:shadow-none"
			>
				<span class="material-symbols-outlined">arrow_back</span>
				Back
			</button>
		{/if}
	</div>
	<button
		onclick={onContinue}
		class="flex items-center gap-2 bg-primary px-8 py-4 text-black shadow-[8px_8px_0px_0px_var(--color-primary)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_var(--color-primary)] active:translate-x-1 active:translate-y-1 active:shadow-none"
	>
		{continueLabel}
		<span class="material-symbols-outlined">arrow_forward</span>
	</button>
</footer>
