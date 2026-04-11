<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import type { RouteStop } from '$lib/types/mapTypes';

	type Props = {
		map: maplibregl.Map | null;
		stop: RouteStop;
	};

	let { map, stop }: Props = $props();
	const POPUP_ANIMATION_MS = 180;

	function escapeHtml(input: string): string {
		return input
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#39;');
	}

	function buildPopupHtml(currentStop: RouteStop): string {
		const detourKm = (currentStop.detourDistance / 1000).toFixed(1);
		const detourMinutes = Math.max(1, Math.round(currentStop.detourTime / 60));
		const rating = currentStop.rating?.rate ?? 0;
		const name = escapeHtml(currentStop.identifier.name);
		const category = escapeHtml(currentStop.identifier.type);
		const address = escapeHtml(currentStop.identifier.address);

		return `
			<div class="stop-popup-card">
				<p class="stop-popup-label">${category}</p>
				<h4 class="stop-popup-title">${name}</h4>
				<p class="stop-popup-meta">Detour: ${detourKm} km · ${detourMinutes} min</p>
				<p class="stop-popup-meta">Rating: ${rating.toFixed(1)} / 5</p>
				<p class="stop-popup-address">${address}</p>
			</div>
		`;
	}

	$effect(() => {
		if (!map) {
			return;
		}

		const { lng, lat } = stop.identifier.location;
		const markerElement = document.createElement('button');
		markerElement.type = 'button';
		markerElement.className =
			'h-6 w-6 border-[3px] border-black bg-secondary shadow-[4px_4px_0px_0px_var(--color-secondary)] hover:cursor-pointer hover:ring-2 hover:ring-primary hover:outline-none hover:z-800 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-black hover:rounded-full transition-all delay-50 duration-500 ease-in-out';
		markerElement.setAttribute('aria-label', `Show details for ${stop.identifier.name}`);

		const popup = new maplibregl.Popup({
			closeButton: false,
			closeOnClick: false,
			offset: 14,
			className: 'stop-popup'
		})
			.setLngLat([lng, lat])
			.setHTML(buildPopupHtml(stop));

		let hideTimeout: ReturnType<typeof setTimeout> | null = null;

		const clearHideTimeout = () => {
			if (!hideTimeout) {
				return;
			}

			clearTimeout(hideTimeout);
			hideTimeout = null;
		};

		const showPopup = () => {
			clearHideTimeout();

			if (!popup.isOpen()) {
				popup.addTo(map);
			}

			const popupElement = popup.getElement();
			popupElement.classList.remove('stop-popup-exit');
			popupElement.classList.add('stop-popup-enter');
			popupElement.removeEventListener('mouseenter', showPopup);
			popupElement.removeEventListener('mouseleave', hidePopup);

			requestAnimationFrame(() => {
				if (popup.isOpen()) {
					popupElement.classList.add('stop-popup-visible');
				}
			});

			popupElement.addEventListener('mouseenter', showPopup);
			popupElement.addEventListener('mouseleave', hidePopup);
		};

		const hidePopup = () => {
			clearHideTimeout();

			if (!popup.isOpen()) {
				return;
			}

			const popupElement = popup.getElement();
			popupElement.classList.remove('stop-popup-visible');
			popupElement.classList.add('stop-popup-exit');

			hideTimeout = setTimeout(() => {
				if (!popup.isOpen()) {
					return;
				}

				const currentPopupElement = popup.getElement();
				currentPopupElement.removeEventListener('mouseenter', showPopup);
				currentPopupElement.removeEventListener('mouseleave', hidePopup);
				popup.remove();
			}, POPUP_ANIMATION_MS);
		};

		markerElement.addEventListener('mouseenter', showPopup);
		markerElement.addEventListener('mouseleave', hidePopup);

		const marker = new maplibregl.Marker({ element: markerElement, anchor: 'bottom' })
			.setLngLat([lng, lat])
			.addTo(map);

		return () => {
			clearHideTimeout();
			if (popup.isOpen()) {
				const popupElement = popup.getElement();
				popupElement.removeEventListener('mouseenter', showPopup);
				popupElement.removeEventListener('mouseleave', hidePopup);
			}
			markerElement.removeEventListener('mouseenter', showPopup);
			markerElement.removeEventListener('mouseleave', hidePopup);
			popup.remove();
			marker.remove();
		};
	});
</script>

<style>
    button:hover {
        transition: 0.3s ease-in-out;
    }

	:global(.maplibregl-popup.stop-popup .maplibregl-popup-content) {
		padding: 0;
		background: transparent;
		box-shadow: none;
        z-index: 900;
	}

	:global(.maplibregl-popup.stop-popup) {
		opacity: 0;
		transform: translateY(8px) scale(0.88);
		transform-origin: bottom center;
		transition:
			opacity 360ms ease,
			transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: opacity, transform;
	}

	:global(.maplibregl-popup.stop-popup.stop-popup-visible) {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	:global(.maplibregl-popup.stop-popup .maplibregl-popup-tip) {
		border-top-color: var(--color-primary);
	}

	:global(.stop-popup-card) {
		min-width: 14rem;
		border: 3px solid var(--color-primary);
		background: #0a0a0a;
		padding: 0.75rem;
		box-shadow: 6px 6px 0 0 var(--color-primary);
        z-index: 900;
	}

	:global(.stop-popup-label) {
		margin: 0;
		font-size: 0.625rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-primary);
	}

	:global(.stop-popup-title) {
		margin: 0.2rem 0 0;
		font-size: 0.95rem;
		font-weight: 800;
		text-transform: uppercase;
		color: #fff;
	}

	:global(.stop-popup-meta) {
		margin: 0.35rem 0 0;
		font-size: 0.75rem;
		text-transform: uppercase;
		color: #fff;
		opacity: 0.9;
	}

	:global(.stop-popup-address) {
		margin: 0.4rem 0 0;
		font-size: 0.7rem;
		line-height: 1.3;
		color: var(--color-on-surface-variant);
	}
</style>
