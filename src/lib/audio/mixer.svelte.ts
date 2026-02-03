import { Sound, type SoundConfig } from './sound.svelte';

export class Mixer {
	private _context: AudioContext | null = null;
	private _master: GainNode | null = null;
	private _masterVolume: number = $state(1);
	private _sounds: Sound[] = $state([]);
	private _isInitialized: boolean = $state(false);

	get masterVolume() {
		return this._masterVolume;
	}

	set masterVolume(volume) {
		this._masterVolume = volume;
		if (this._master) {
			this._master.gain.value = volume;
		}
	}

	get sounds() {
		return this._sounds;
	}

	get isInitialized() {
		return this._isInitialized;
	}

	get audioContext() {
		return this.ensureContext().context;
	}

	private ensureContext() {
		if (typeof window === 'undefined') {
			throw new Error('AudioContext is only available in the browser (not during SSR).');
		}

		if (!this._context) {
			this._context = new AudioContext();
			this._master = this._context.createGain();
			this._master.gain.value = this._masterVolume;
			this._master.connect(this._context.destination);
		}

		return { context: this._context, master: this._master! };
	}

	public createGain() {
		const { context, master } = this.ensureContext();
		const gain = context.createGain();
		gain.connect(master);
		return gain;
	}

	public async loadBuffer(url: string) {
		const { context } = this.ensureContext();
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch audio file: ${response.status} ${response.statusText}`
			);
		}
		const arrayBuffer = await response.arrayBuffer();
		return context.decodeAudioData(arrayBuffer);
	}

	public async ensureRunning() {
		const { context } = this.ensureContext();
		if (context.state === 'suspended') {
			await context.resume();
		}
	}

	public async init(configs: SoundConfig[]): Promise<void> {
		this._sounds = configs.map((config) => new Sound(this, config));
		await Promise.all(this._sounds.map((sound) => sound.load()));
		this._isInitialized = true;
	}
}

export const mixer = new Mixer();
