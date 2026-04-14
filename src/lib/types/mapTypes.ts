export type RouteStopIdentifier = {
	address: string;
	id: string;
	location: {
		lat: number;
		lng: number;
	};
	name: string;
	type: string;
};

export type RouteStopOpeningHours = {
	closes: string; // hhmm format
	opens: string; // hhmm format
};

export type RouteStopWeeklyOpeningHours = {
	monday: RouteStopOpeningHours;
	tuesday: RouteStopOpeningHours;
	wednesday: RouteStopOpeningHours;
	thursday: RouteStopOpeningHours;
	friday: RouteStopOpeningHours;
	saturday: RouteStopOpeningHours;
	sunday: RouteStopOpeningHours;
};

export type RouteStop = {
	detourDistance: number; // in meters
	detourTime: number; // in seconds
	identifier: RouteStopIdentifier;
	openingHours: RouteStopWeeklyOpeningHours;
	rating: {
		rate: number; // 0-5
	};
	website: string;
};

export type Coordinates = {
	lat: number;
	lng: number;
};

export type StopType = 'Restaurant' | 'Cafe' | 'Park' | 'Fuel';

export type RankingPriority = 'detour_distance' | 'detour_time' | 'rating';

export type StopConfig = {
	id: string;
	targetPercent: number; // 0-100 of route progress
	stopDurationMinutes: number;
	stopType: StopType;
};

export type PathPlanningInput = {
	startLocation: string;
	destinationLocation: string;
	origin: Coordinates;
	destination: Coordinates;
	stopConfigs: StopConfig[];
	suggestionLimit: number;
	rankingPriority: RankingPriority;
};
