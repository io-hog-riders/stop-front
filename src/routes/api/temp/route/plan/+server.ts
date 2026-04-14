import { json } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { RequestHandler } from './$types';
import type {
	Coordinates,
	RankingPriority,
	RouteStop,
	StopConfig,
	StopType
} from '$lib/types/mapTypes';

type RoutePoint = [number, number];

type RoutePlanRequest = {
	origin: Coordinates;
	destination: Coordinates;
	stopConfigs?: StopConfig[];
	suggestionLimit?: number;
	rankingPriority?: RankingPriority;
};

type OverpassElement = {
	type: 'node' | 'way' | 'relation';
	id: number;
	lat?: number;
	lon?: number;
	center?: {
		lat: number;
		lon: number;
	};
	tags?: Record<string, string>;
};

type OverpassResponse = {
	elements?: OverpassElement[];
};

type BackendRoutePlanResponse = {
	route?: {
		points?: Array<{ lng: number; lat: number }>;
		distance?: number;
	};
};

const DEFAULT_SUGGESTION_LIMIT = 6;
const MAX_SUGGESTION_LIMIT = 24;
const SEARCH_RADIUS_METERS = 8000;
const OVERPASS_ENDPOINT =
	(privateEnv['OVERPASS_URL'] || '').trim() || 'https://overpass-api.de/api/interpreter';
const ROUTE_BACKEND_BASE_URL =
	(privateEnv['BACKEND_URL'] || '').trim() ||
	(publicEnv['PUBLIC_BACKEND_URL'] || '').trim() ||
	(privateEnv['ROUTE_BACKEND_URL'] || '').trim() ||
	'';

const STOP_TYPE_FILTERS: Record<StopType, string[]> = {
	Restaurant: ['node["amenity"="restaurant"]', 'way["amenity"="restaurant"]'],
	Cafe: ['node["amenity"="cafe"]', 'way["amenity"="cafe"]'],
	Park: ['node["leisure"="park"]', 'way["leisure"="park"]'],
	Fuel: ['node["amenity"="fuel"]', 'way["amenity"="fuel"]']
};

const EMPTY_WEEKLY_HOURS = {
	monday: { opens: '0000', closes: '0000' },
	tuesday: { opens: '0000', closes: '0000' },
	wednesday: { opens: '0000', closes: '0000' },
	thursday: { opens: '0000', closes: '0000' },
	friday: { opens: '0000', closes: '0000' },
	saturday: { opens: '0000', closes: '0000' },
	sunday: { opens: '0000', closes: '0000' }
} as const;

function normalizeSuggestionLimit(value: number | undefined): number {
	if (!Number.isFinite(value)) return DEFAULT_SUGGESTION_LIMIT;
	const rounded = Math.round(value as number);
	return Math.min(MAX_SUGGESTION_LIMIT, Math.max(1, rounded));
}

function normalizePercent(percent: number): number {
	if (!Number.isFinite(percent)) return 50;
	return Math.min(100, Math.max(1, percent));
}

function toRadians(value: number): number {
	return (value * Math.PI) / 180;
}

function distanceInMeters(a: RoutePoint, b: RoutePoint): number {
	const EARTH_RADIUS = 6371000;
	const lat1 = toRadians(a[1]);
	const lat2 = toRadians(b[1]);
	const deltaLat = toRadians(b[1] - a[1]);
	const deltaLng = toRadians(b[0] - a[0]);

	const sinLat = Math.sin(deltaLat / 2);
	const sinLng = Math.sin(deltaLng / 2);
	const haversine = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
	const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

	return EARTH_RADIUS * centralAngle;
}

function interpolatePoint(a: RoutePoint, b: RoutePoint, ratio: number): RoutePoint {
	const safeRatio = Math.min(1, Math.max(0, ratio));
	return [a[0] + (b[0] - a[0]) * safeRatio, a[1] + (b[1] - a[1]) * safeRatio];
}

function findRoutePointAtPercent(points: RoutePoint[], percent: number): RoutePoint {
	if (points.length === 0) return [0, 0];
	if (points.length === 1) return points[0];

	const segmentDistances = points
		.slice(1)
		.map((point, index) => distanceInMeters(points[index], point));
	const totalDistance = segmentDistances.reduce((sum, distance) => sum + distance, 0);
	if (totalDistance <= 0) return points[0];

	const targetDistance = (normalizePercent(percent) / 100) * totalDistance;
	let traversed = 0;

	for (let index = 0; index < segmentDistances.length; index++) {
		const nextDistance = traversed + segmentDistances[index];
		if (targetDistance <= nextDistance) {
			const localDistance = targetDistance - traversed;
			const ratio =
				segmentDistances[index] === 0 ? 0 : localDistance / segmentDistances[index];
			return interpolatePoint(points[index], points[index + 1], ratio);
		}
		traversed = nextDistance;
	}

	return points[points.length - 1];
}

function buildOverpassQuery(stopType: StopType, anchors: RoutePoint[]): string {
	const filters = STOP_TYPE_FILTERS[stopType] ?? [];
	const clauses = anchors
		.flatMap(([lng, lat]) =>
			filters.map((filter) => `${filter}(around:${SEARCH_RADIUS_METERS},${lat},${lng});`)
		)
		.join('');

	return `[out:json][timeout:25];(${clauses});out body center tags;`;
}

function parseNumericTag(tags: Record<string, string> | undefined, key: string): number {
	if (!tags?.[key]) return 0;
	const value = Number.parseFloat(tags[key]);
	if (!Number.isFinite(value)) return 0;
	return value;
}

function parseAddress(tags: Record<string, string> | undefined): string {
	if (!tags) return 'Address unavailable';
	const fromFields = [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']]
		.filter(Boolean)
		.join(' ')
		.trim();

	return tags['addr:full'] || fromFields || tags.name || 'Address unavailable';
}

function normalizeStopName(tags: Record<string, string> | undefined, stopType: StopType): string {
	return tags?.name || `${stopType} stop`;
}

function elementLocation(element: OverpassElement): RoutePoint | null {
	if (typeof element.lon === 'number' && typeof element.lat === 'number') {
		return [element.lon, element.lat];
	}
	if (typeof element.center?.lon === 'number' && typeof element.center?.lat === 'number') {
		return [element.center.lon, element.center.lat];
	}
	return null;
}

async function fetchRoutePoints(
	origin: Coordinates,
	destination: Coordinates
): Promise<{
	points: RoutePoint[];
	distance: number;
}> {
	if (!ROUTE_BACKEND_BASE_URL) {
		throw new Error('Missing BACKEND_URL (or PUBLIC_BACKEND_URL) for route fetching');
	}

	const response = await fetch(`${ROUTE_BACKEND_BASE_URL}/api/v1/route/plan/`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			origin,
			destination
		})
	});

	if (!response.ok) {
		throw new Error(`Route provider failed with status ${response.status}`);
	}

	const data = (await response.json()) as BackendRoutePlanResponse;
	const routePoints = data.route?.points;
	const points = routePoints?.map((point) => [point.lng, point.lat] as RoutePoint);
	const distance = Number(data.route?.distance ?? 0);

	if (!Array.isArray(points) || points.length < 2) {
		throw new Error('Route provider returned no route geometry');
	}

	return {
		points,
		distance: Number.isFinite(distance) ? distance : 0
	};
}

function rankStops(stops: RouteStop[], rankingPriority: RankingPriority): RouteStop[] {
	const ranked = [...stops];
	ranked.sort((a, b) => {
		if (rankingPriority === 'rating') {
			return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
		}
		if (rankingPriority === 'detour_time') {
			return a.detourTime - b.detourTime;
		}
		return a.detourDistance - b.detourDistance;
	});
	return ranked;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as RoutePlanRequest;
		const { origin, destination } = body;

		if (!origin || !destination) {
			return json({ error: 'Missing origin or destination' }, { status: 400 });
		}

		const suggestionLimit = normalizeSuggestionLimit(body.suggestionLimit);
		const rankingPriority: RankingPriority = body.rankingPriority ?? 'detour_distance';
		const stopConfigs = (body.stopConfigs ?? []).map((config) => ({
			...config,
			targetPercent: normalizePercent(config.targetPercent)
		}));

		const routeData = await fetchRoutePoints(origin, destination);

		if (stopConfigs.length === 0) {
			return json({
				route: {
					points: routeData.points.map(([lng, lat]) => ({ lng, lat })),
					distance: routeData.distance
				},
				suggestedStops: []
			});
		}

		const anchorsByType = new Map<StopType, Array<{ config: StopConfig; point: RoutePoint }>>();
		for (const config of stopConfigs) {
			const point = findRoutePointAtPercent(routeData.points, config.targetPercent);
			const existing = anchorsByType.get(config.stopType) ?? [];
			existing.push({ config, point });
			anchorsByType.set(config.stopType, existing);
		}

		const dedupedStops = new Map<string, RouteStop>();

		for (const [stopType, anchors] of anchorsByType.entries()) {
			const overpassQuery = buildOverpassQuery(
				stopType,
				anchors.map((anchor) => anchor.point)
			);

			const overpassResponse = await fetch(OVERPASS_ENDPOINT, {
				method: 'POST',
				headers: {
					'content-type': 'text/plain;charset=UTF-8'
				},
				body: overpassQuery
			});

			console.log(overpassResponse);

			if (!overpassResponse.ok) {
				continue;
			}

			const overpassData = (await overpassResponse.json()) as OverpassResponse;
			const elements = overpassData.elements ?? [];

			for (const element of elements) {
				const location = elementLocation(element);
				if (!location) continue;

				let bestAnchorDistance = Number.POSITIVE_INFINITY;
				for (const anchor of anchors) {
					const anchorDistance = distanceInMeters(anchor.point, location);
					if (anchorDistance < bestAnchorDistance) {
						bestAnchorDistance = anchorDistance;
					}
				}

				if (bestAnchorDistance > SEARCH_RADIUS_METERS) {
					continue;
				}

				const detourDistance = bestAnchorDistance * 2;
				const detourTime = Math.max(60, Math.round(detourDistance / 13.89));
				const tags = element.tags ?? {};
				const ratingFromTag = parseNumericTag(tags, 'rating');
				const rating = Math.min(5, Math.max(0, ratingFromTag));
				const key = `${stopType}-${element.type}-${element.id}`;

				const candidate: RouteStop = {
					detourDistance,
					detourTime,
					identifier: {
						address: parseAddress(tags),
						id: key,
						location: {
							lat: location[1],
							lng: location[0]
						},
						name: normalizeStopName(tags, stopType),
						type: stopType
					},
					openingHours: {
						...EMPTY_WEEKLY_HOURS
					},
					rating: {
						rate: rating
					},
					website: tags.website || ''
				};

				const current = dedupedStops.get(key);
				if (!current || candidate.detourDistance < current.detourDistance) {
					dedupedStops.set(key, candidate);
				}
			}
		}

		const rankedStops = rankStops([...dedupedStops.values()], rankingPriority).slice(
			0,
			suggestionLimit
		);

		return json({
			route: {
				points: routeData.points.map(([lng, lat]) => ({ lng, lat })),
				distance: routeData.distance
			},
			suggestedStops: rankedStops.map((stop) => ({
				detourDistance: stop.detourDistance,
				detourTime: stop.detourTime,
				ident: stop.identifier,
				openingHours: stop.openingHours,
				rating: stop.rating,
				website: stop.website
			}))
		});
	} catch (error) {
		const details = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: `Could not plan route: ${details}` }, { status: 500 });
	}
};
