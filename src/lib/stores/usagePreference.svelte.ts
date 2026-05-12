export type UsageType = 'family' | 'driver' | 'disabled' | 'students';

export type UsageTypeMeta = {
	value: UsageType;
	title: string;
	desc: string;
	icon: string;
	code: string;
	badge: string;
};

export const USAGE_TYPES: UsageTypeMeta[] = [
	{
		value: 'driver',
		title: 'Individual Driver',
		desc: 'Alcohol-free stops — keep the trip dry.',
		icon: 'person',
		code: 'TYPE_01',
		badge: 'No alcohol'
	},
	{
		value: 'family',
		title: 'Family Trip',
		desc: "Kid-friendly stops with a play area.",
		icon: 'family_restroom',
		code: 'TYPE_02',
		badge: 'Kids area'
	},
	{
		value: 'disabled',
		title: 'Accessible Travel',
		desc: 'Wheelchair-accessible stops.',
		icon: 'accessible',
		code: 'TYPE_03',
		badge: 'Wheelchair access'
	},
	{
		value: 'students',
		title: 'Group of Friends',
		desc: 'Stops that have a bar on site.',
		icon: 'group',
		code: 'TYPE_04',
		badge: 'Bar on site'
	}
];

const STORAGE_KEY = 'stopfinder.usageType';
const SEEN_KEY = 'stopfinder.usageType.seen';

function readFromStorage(): UsageType | null {
	if (typeof localStorage === 'undefined') return null;
	const raw = localStorage.getItem(STORAGE_KEY);
	if (raw && USAGE_TYPES.some((t) => t.value === raw)) {
		return raw as UsageType;
	}
	return null;
}

function readSeen(): boolean {
	if (typeof localStorage === 'undefined') return false;
	return localStorage.getItem(SEEN_KEY) === '1';
}

let current = $state<UsageType | null>(readFromStorage());
let seen = $state<boolean>(readSeen());

export const usagePreference = {
	get current() {
		return current;
	},
	get hasSeenPrompt() {
		return seen;
	},
	set(value: UsageType) {
		current = value;
		this.markSeen();
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, value);
		}
	},
	clear() {
		current = null;
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(STORAGE_KEY);
		}
	},
	markSeen() {
		seen = true;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(SEEN_KEY, '1');
		}
	},
	meta(value: UsageType | null = current): UsageTypeMeta | null {
		if (!value) return null;
		return USAGE_TYPES.find((t) => t.value === value) ?? null;
	}
};
