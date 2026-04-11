export type RouteStopIdentifier = {
    address: string;
    id: string;
    location: {
        lat: number;
        lng: number;
    }
    name: string;
    type: string;
}

export type RouteStopOpeningHours = {
    closes: string; // hhmm format
    opens: string; // hhmm format
}

export type RouteStopWeeklyOpeningHours = {
    monday: RouteStopOpeningHours;
    tuesday: RouteStopOpeningHours;
    wednesday: RouteStopOpeningHours;
    thursday: RouteStopOpeningHours;
    friday: RouteStopOpeningHours;
    saturday: RouteStopOpeningHours;
    sunday: RouteStopOpeningHours;
}

export type RouteStop = {
	detourDistance: number; // in meters
    detourTime: number; // in seconds
    identifier: RouteStopIdentifier;
    openingHours: RouteStopWeeklyOpeningHours;
    rating: {
        rate: number; // 0-5
    }
    website: string;
};