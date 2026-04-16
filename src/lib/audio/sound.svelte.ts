import { type Mixer } from './mixer.svelte';

export type SoundConfig = {
	id: string;
	label: string;
	url: string;
};

export class Sound {
	public readonly id: string;
	public readonly label: string;
	public readonly url: string;

	private _volume: number = $state(1);
	private _isStarting: boolean = $state(false);
	private _isPlaying: boolean = $state(false);
	private _isLoaded: boolean = $state(false);
	private _isLoading: boolean = $state(false);
	private _loadPromise: Promise<void> | null = null;

	private buffer: AudioBuffer | null = null;
	private gain: GainNode;
	private source: AudioBufferSourceNode | null = null;

	public constructor(
		private mixer: Mixer,
		config: SoundConfig
	) {
		this.id = config.id;
		this.label = config.label;
		this.url = config.url;
		this.gain = mixer.createGain();
	}

	get volume() {
		return this._volume;
	}

	set volume(volume) {
		this._volume = volume;
		this.gain.gain.value = volume;
	}

	get isStarting() {
		return this._isStarting;
	}

	get isPlaying() {
		return this._isPlaying;
	}

	get isLoaded() {
		return this._isLoaded;
	}

	get isLoading() {
		return this._isLoading;
	}

	async load() {
		if (this._isLoaded) return;
		if (this._loadPromise) return this._loadPromise;

		this._loadPromise = (async () => {
			this._isLoading = true;
			try {
				this.buffer = await this.mixer.loadBuffer(this.url);
			} finally {
				this._isLoading = false;
				this._loadPromise = null;
			}
			this._isLoaded = true;
		})();
		return this._loadPromise;
	}

	public async play(): Promise<void> {
		if (this._isPlaying) return;
		if (this._isStarting) return;

		this._isStarting = true;

		try {
			if (!this._isLoaded) {
				await this.load();
			}

			if (!this.buffer) return;

			const context = this.mixer.audioContext;
			this.source = new AudioBufferSourceNode(context, {
				buffer: this.buffer,
				loop: true
			});
			this.source.connect(this.gain);
			this.source.start();
			this._isPlaying = true;

			this.source.onended = () => {
				if (this._isPlaying) {
					this._isPlaying = false;
					this.source = null;
				}
			};
		} finally {
			this._isStarting = false;
		}
	}

	public stop(): void {
		if (!this._isPlaying || !this.source) return;

		this.source.stop();
		this.source.disconnect();
		this.source = null;
		this._isPlaying = false;
	}
}
