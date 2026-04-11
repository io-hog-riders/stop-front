import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const payload = (await request.json().catch(() => ({}))) as {
		startedFrom?: string;
		maxDeviationKm?: number;
	};

	const stopsFound = Math.max(1, Math.min(6, Math.floor(Math.random() * 6) + 1));

	return json({
		message: `Route preview ready from ${payload.startedFrom ?? 'your start point'}`,
		stopsFound,
		maxDeviationKm: payload.maxDeviationKm ?? null,
		generatedAt: new Date().toISOString()
	});
};
