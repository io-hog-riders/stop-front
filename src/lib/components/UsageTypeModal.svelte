<script lang="ts">
	import { USAGE_TYPES, usagePreference, type UsageType } from '$lib/stores/usagePreference.svelte';

	let {
		open = $bindable(false),
		firstVisit = false
	}: { open: boolean; firstVisit?: boolean } = $props();

	function close() {
		usagePreference.markSeen();
		open = false;
	}

	function pick(value: UsageType) {
		usagePreference.set(value);
		open = false;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={onKeyDown} />

{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="usage-modal-title"
	>
		<button
			type="button"
			aria-label="Close"
			class="absolute inset-0 cursor-default"
			onclick={close}
		></button>

		<div
			class="relative w-full max-w-3xl border-[4px] border-primary bg-[#0e0e0e] shadow-[12px_12px_0px_0px_var(--color-primary)]"
		>
			<header class="flex items-center justify-between border-b-[3px] border-primary px-6 py-4">
				<div>
					<p class="font-label text-[10px] tracking-[0.2em] text-secondary uppercase">
						{firstVisit ? 'SYSTEM_HANDSHAKE' : 'PROFILE_OVERRIDE'}
					</p>
					<h2
						id="usage-modal-title"
						class="font-headline text-2xl font-black tracking-tight text-primary uppercase"
					>
						{firstVisit ? 'How will you use StopFinder?' : 'Change Usage Type'}
					</h2>
				</div>
				<button
					type="button"
					onclick={close}
					class="material-symbols-outlined p-2 text-white hover:bg-primary hover:text-black"
					aria-label="Close"
				>
					close
				</button>
			</header>

			<div class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
				{#each USAGE_TYPES as opt (opt.value)}
					{@const active = usagePreference.current === opt.value}
					<button
						type="button"
						onclick={() => pick(opt.value)}
						class="group relative border-[3px] p-5 text-left transition-all
							{active
							? 'translate-x-1 translate-y-1 border-primary bg-[#0e0e0e] shadow-[6px_6px_0px_0px_var(--color-primary)]'
							: 'border-surface-variant bg-[#0e0e0e] hover:translate-x-1 hover:translate-y-1 hover:border-primary hover:shadow-[6px_6px_0px_0px_var(--color-primary)]'}"
					>
						<div class="mb-3 flex items-start justify-between">
							<span
								class="material-symbols-outlined text-3xl {active
									? 'text-primary'
									: 'text-secondary group-hover:text-primary'}"
							>
								{opt.icon}
							</span>
							<span class="font-mono text-[10px] text-outline">{opt.code}</span>
						</div>
						<div
							class="font-headline text-lg font-black uppercase {active
								? 'text-primary'
								: 'text-white group-hover:text-primary'}"
						>
							{opt.title}
						</div>
						<p class="mt-1 font-label text-[11px] text-on-surface-variant uppercase">
							{opt.desc}
						</p>
					</button>
				{/each}
			</div>

			<footer class="flex items-center justify-between border-t-[3px] border-primary px-6 py-4">
				<p class="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">
					{firstVisit
						? 'Optional — skip to keep results unfiltered.'
						: 'Selection applies to all future route plans.'}
				</p>
				<button
					type="button"
					onclick={close}
					class="border-[3px] border-white bg-[#0e0e0e] px-4 py-2 font-headline text-xs font-black tracking-widest text-white uppercase hover:bg-white hover:text-black"
				>
					{firstVisit ? 'Skip for now' : 'Close'}
				</button>
			</footer>
		</div>
	</div>
{/if}
