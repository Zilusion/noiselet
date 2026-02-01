// src\lib\audio\sounds.ts
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

export function getAvailableSounds(): string[] {
	return Object.keys(soundFiles)
		.map((path) => {
			const match = path.match(/\/([^/]+)\.mp3$/);
			return match ? match[1] : '';
		})
		.filter(Boolean) as string[];
}
