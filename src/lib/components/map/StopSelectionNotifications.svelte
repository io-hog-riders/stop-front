<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	type NotificationVariant = 'selected' | 'deselected';
	type StopSelectionEvent = {
		id: number;
		stopName: string;
		variant: NotificationVariant;
	};
	type StopNotification = {
		id: number;
		message: string;
		variant: NotificationVariant;
	};

	let { selectionEvent }: { selectionEvent: StopSelectionEvent | null } = $props();

	const NOTIFICATION_TTL_MS = 3200;
	const MAX_NOTIFICATIONS = 5;

	let notifications: StopNotification[] = $state([]);
	let lastProcessedEventId = $state(0);
	const notificationTimers = new SvelteMap<number, ReturnType<typeof setTimeout>>();

	function dismiss(id: number) {
		notifications = notifications.filter((notification) => notification.id !== id);

		const timer = notificationTimers.get(id);
		if (timer) {
			clearTimeout(timer);
			notificationTimers.delete(id);
		}
	}

	function handleDismiss(id: number) {
		dismiss(id);
	}

	function scheduleDismiss(id: number) {
		const existingTimeout = notificationTimers.get(id);
		if (existingTimeout) {
			clearTimeout(existingTimeout);
		}

		const timeout = setTimeout(() => {
			dismiss(id);
		}, NOTIFICATION_TTL_MS);

		notificationTimers.set(id, timeout);
	}

	function pushNotification(event: StopSelectionEvent) {
		const message = `${event.variant === 'selected' ? 'Selected' : 'Deselected'} ${event.stopName}`;

		notifications = [{ id: event.id, message, variant: event.variant }, ...notifications].slice(
			0,
			MAX_NOTIFICATIONS
		);

		for (const existingId of [...notificationTimers.keys()]) {
			if (!notifications.some((notification) => notification.id === existingId)) {
				dismiss(existingId);
			}
		}

		scheduleDismiss(event.id);
	}

	$effect(() => {
		if (!selectionEvent || selectionEvent.id <= lastProcessedEventId) {
			return;
		}

		lastProcessedEventId = selectionEvent.id;
		pushNotification(selectionEvent);
	});

	$effect(() => {
		return () => {
			for (const timeout of notificationTimers.values()) {
				clearTimeout(timeout);
			}
			notificationTimers.clear();
		};
	});
</script>

<div class="pointer-events-none absolute top-4 right-4 z-20 flex w-72 flex-col gap-2">
	{#each notifications as notification (notification.id)}
		<div
			animate:flip={{ duration: 180 }}
			transition:fly={{ x: 16, y: -8, duration: 180 }}
			class={`pointer-events-auto flex items-center gap-3 border-2 bg-black px-3 py-2 text-xs font-semibold tracking-wide uppercase shadow-[4px_4px_0_0] ${notification.variant === 'selected' ? 'border-primary text-primary shadow-primary' : 'border-tertiary text-tertiary shadow-tertiary'}`}
		>
			<p class="min-w-0 flex-1 leading-4">{notification.message}</p>
			<button
				type="button"
				onclick={() => handleDismiss(notification.id)}
				aria-label={`Dismiss ${notification.message}`}
				class="shrink-0 px-1 text-sm leading-none transition hover:text-white/80 focus:ring-2 focus:ring-white focus:outline-none"
			>
				x
			</button>
		</div>
	{/each}
</div>
