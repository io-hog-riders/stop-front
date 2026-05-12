<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import type { StopType } from '$lib/types/mapTypes';

	type NotificationVariant = 'selected' | 'deselected' | 'missing';
	type StopSelectionEvent = {
		id: number;
		stopName: string;
		variant: 'selected' | 'deselected';
	};
	type MissingStopsEvent = {
		id: number;
		types: StopType[];
	};
	type StopNotification = {
		id: number;
		message: string;
		variant: NotificationVariant;
	};

	let {
		selectionEvent,
		missingStopsEvent = null
	}: {
		selectionEvent: StopSelectionEvent | null;
		missingStopsEvent?: MissingStopsEvent | null;
	} = $props();

	const NOTIFICATION_TTL_MS = 3200;
	const MISSING_NOTIFICATION_TTL_MS = 5000;
	const MAX_NOTIFICATIONS = 5;

	const STOP_TYPE_LABEL: Record<StopType, string> = {
		restaurant: 'restaurants',
		gas_station: 'gas stations',
		hotel: 'hotels',
		rest_area: 'rest areas',
		charging_station: 'charging stations',
		attraction: 'attractions',
		parking: 'parking',
		hospital: 'hospitals'
	};

	let notifications: StopNotification[] = $state([]);
	let lastProcessedSelectionId = $state(0);
	let lastProcessedMissingId = $state(0);
	let internalIdCounter = 0;
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

	function scheduleDismiss(id: number, ttlMs: number) {
		const existingTimeout = notificationTimers.get(id);
		if (existingTimeout) {
			clearTimeout(existingTimeout);
		}

		const timeout = setTimeout(() => {
			dismiss(id);
		}, ttlMs);

		notificationTimers.set(id, timeout);
	}

	function pushNotification(notification: StopNotification, ttlMs: number) {
		notifications = [notification, ...notifications].slice(0, MAX_NOTIFICATIONS);

		for (const existingId of [...notificationTimers.keys()]) {
			if (!notifications.some((n) => n.id === existingId)) {
				dismiss(existingId);
			}
		}

		scheduleDismiss(notification.id, ttlMs);
	}

	$effect(() => {
		if (!selectionEvent || selectionEvent.id <= lastProcessedSelectionId) {
			return;
		}

		lastProcessedSelectionId = selectionEvent.id;
		const message = `${selectionEvent.variant === 'selected' ? 'Selected' : 'Deselected'} ${selectionEvent.stopName}`;
		pushNotification(
			{ id: selectionEvent.id, message, variant: selectionEvent.variant },
			NOTIFICATION_TTL_MS
		);
	});

	$effect(() => {
		if (!missingStopsEvent || missingStopsEvent.id <= lastProcessedMissingId) {
			return;
		}

		lastProcessedMissingId = missingStopsEvent.id;
		for (const type of missingStopsEvent.types) {
			const label = STOP_TYPE_LABEL[type] ?? type;
			const id = ++internalIdCounter + missingStopsEvent.id * 1000;
			pushNotification(
				{ id, message: `No ${label} found along the route`, variant: 'missing' },
				MISSING_NOTIFICATION_TTL_MS
			);
		}
	});

	$effect(() => {
		return () => {
			for (const timeout of notificationTimers.values()) {
				clearTimeout(timeout);
			}
			notificationTimers.clear();
		};
	});

	function variantClasses(variant: NotificationVariant): string {
		if (variant === 'selected') return 'border-primary text-primary shadow-primary';
		if (variant === 'deselected') return 'border-tertiary text-tertiary shadow-tertiary';
		return 'border-error text-error shadow-[4px_4px_0_0_var(--color-error)]';
	}
</script>

<div class="pointer-events-none absolute top-4 right-4 z-20 flex w-72 flex-col gap-2">
	{#each notifications as notification (notification.id)}
		<div
			animate:flip={{ duration: 180 }}
			transition:fly={{ x: 16, y: -8, duration: 180 }}
			class={`pointer-events-auto flex items-center gap-3 border-2 bg-black px-3 py-2 text-xs font-semibold tracking-wide uppercase shadow-[4px_4px_0_0] ${variantClasses(notification.variant)}`}
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
