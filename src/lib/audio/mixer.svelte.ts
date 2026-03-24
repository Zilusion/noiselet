import { Sound, type SoundConfig } from './sound.svelte';

export class Mixer {
	private _context: AudioContext | null = null;
	private _master: GainNode | null = null;
	private _isPaused: boolean = $state(false);
	private _masterVolume: number = $state(1);
	private _sounds: Sound[] = $state([]);
	private _isInitialized: boolean = $state(false);

	get isPaused() {
		return this._isPaused;
	}

	get hasActiveSounds(): boolean {
		return this._sounds.some((sound) => sound.isPlaying);
	}

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

	public async init(configs: SoundConfig[]): Promise<void> {
		if (this._isInitialized) {
			return;
		}
		this._sounds = configs.map((config) => new Sound(this, config));
		await Promise.all(this._sounds.map((sound) => sound.load()));
		this._isInitialized = true;
	}

	public async pause() {
		const { context } = this.ensureContext();
		if (context.state === 'running') {
			await context.suspend();
		}
		this._isPaused = true;
	}

	public async resume() {
		const { context } = this.ensureContext();

		if (context.state === 'suspended') {
			await context.resume();
		}
		this._isPaused = false;
	}
}

export const mixer = new Mixer();
