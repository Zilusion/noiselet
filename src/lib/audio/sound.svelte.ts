import { mixer, type Mixer } from './mixer.svelte';

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
	private _isPlaying: boolean = $state(false);
	private _isLoaded: boolean = $state(false);

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

	get isPlaying() {
		return this._isPlaying;
	}

	get isLoaded() {
		return this._isLoaded;
	}

	async load() {
		this.buffer = await mixer.loadBuffer(this.url);
		this._isLoaded = true;
	}

	public play(): void {
		if (this._isPlaying || !this.buffer) return;

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
	}

	public stop(): void {
		if (!this._isPlaying || !this.source) return;

		this.source.stop();
		this.source.disconnect();
		this.source = null;
		this._isPlaying = false;
	}

	public toggle(): void {
		if (this._isPlaying) {
			this.stop();
		} else {
			this.play();
		}
	}
}
