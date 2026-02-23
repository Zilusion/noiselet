import { mixer } from "./mixer.svelte";

export class SleepTimer {
	private _isRunning: boolean = $state(false);
	private _remainingSeconds: number = $state(0);
	private _timeoutId: ReturnType<typeof setTimeout> | null = null;

	get isRunning() {
		return this._isRunning;
	}

	get remainingSeconds() {
		return this._remainingSeconds;
	}

  public start(seconds: number) {
    this.cancel();
		this._remainingSeconds = seconds;

		const second = () => {
			this._timeoutId = setTimeout(() => {
				this._remainingSeconds--;
				console.log(this._remainingSeconds);
        if (this._remainingSeconds === 0) {
          mixer.togglePause();
          this.cancel();
          return;
        }
				second();
			}, 1000);
		};

		second();
	}

	public cancel() {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
		}
		this._remainingSeconds = 0;
		this._isRunning = false;
	}
}

export const sleepTimer = new SleepTimer();
