// src\lib\audio\sounds.ts
import type { SoundConfig } from './sound.svelte';

export const soundFiles: Record<string, string> = import.meta.glob('$lib/assets/sounds/*.mp3', {
	eager: true,
	import: 'default',
	query: '?url'
});

export function getSoundUrl(soundName: string): string {
	const path = `/src/lib/assets/sounds/${soundName}.mp3`;
	const loader = soundFiles[path];

	if (!loader) {
		throw new Error(`Sound "${soundName}" not found`);
	}

	return loader;
}

function getAvailableSoundIds(): string[] {
	return Object.keys(soundFiles)
		.map((path) => {
			const match = path.match(/\/([^/]+)\.mp3$/);
			return match?.[1];
		})
		.filter((id): id is string => Boolean(id));
}

const SOUND_LABELS: Record<string, string> = {
	rain: 'Rain',
	wind: 'Wind',
	night: 'Night',
	fire: 'Fire',
	forest: 'Forest',
	thunder: 'Thunder',
	ocean: 'Ocean'
};

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getSoundConfigs(): SoundConfig[] {
	return getAvailableSoundIds().map((id) => ({
		id,
		label: SOUND_LABELS[id] ?? capitalize(id),
		url: getSoundUrl(id)
	}));
}
