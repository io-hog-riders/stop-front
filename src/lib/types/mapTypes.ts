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
	website: string;
};

export type Coordinates = {
	lat: number;
	lng: number;
};

export type StopType =
	| 'restaurant'
	| 'gas_station'
	| 'hotel'
	| 'rest_area'
	| 'charging_station'
	| 'attraction'
	| 'parking'
	| 'hospital';

export type StopConfig = {
	id: string;
	targetPercent: number; // 0-100 of route progress
	stopType: StopType;
};

export type PathPlanningInput = {
	startLocation: string;
	destinationLocation: string;
	origin: Coordinates;
	destination: Coordinates;
	stopConfigs: StopConfig[];
};
