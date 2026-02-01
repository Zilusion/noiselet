// src\lib\audio\audio-engine.svelte.ts
const DEFAULT_MASTER_VOLUME = 1;

export class AudioEngine {
	private static _instance: AudioEngine | null = null;
	private _ctx: AudioContext | null = null;
	private _master: GainNode | null = null;
	private _masterVolume = $state(DEFAULT_MASTER_VOLUME);

	private constructor() {}

	static get instance(): AudioEngine {
		if (!AudioEngine._instance) {
			AudioEngine._instance = new AudioEngine();
		}
		return AudioEngine._instance;
	}

	get context(): AudioContext {
		if (typeof window === 'undefined') {
			throw new Error('AudioContext is only available in the browser (not during SSR).');
		}

		if (!this._ctx) {
			this._ctx = new AudioContext();
			this._master = this.context.createGain();
			this._master.gain.value = this._masterVolume;
			this._master.connect(this.context.destination);
		}

		return this._ctx;
	}

	async loadBuffer(url: string): Promise<AudioBuffer> {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch audio file: ${response.status} ${response.statusText}`
			);
		}
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
		return audioBuffer;
	}

	playBuffer(
		buffer: AudioBuffer,
		options?: {
			when?: number;
			playbackRate?: number;
			loop?: boolean;
		}
	) {
		if (!this._master) return;
		const ctx = this.context;
		const source = new AudioBufferSourceNode(ctx, {
			buffer,
			playbackRate: options?.playbackRate ?? 1,
			loop: options?.loop ?? false
		});
		source.connect(this._master);
		const when = options?.when ?? ctx.currentTime;
		source.start(when);
		return source;
	}

	async ensureRunning(): Promise<void> {
		const ctx = this.context;
		if (ctx.state !== 'running') {
			await ctx.resume();
		}
	}

	get masterVolume(): number {
		return this._masterVolume;
	}

	set masterVolume(volume: number) {
		this._masterVolume = volume;
		if (this._master) {
			this._master.gain.value = volume;
		}
	}
}
