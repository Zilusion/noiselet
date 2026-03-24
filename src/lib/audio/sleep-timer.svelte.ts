export class SleepTimer {
	private _isRunning: boolean = $state(false);
	private _remainingSeconds: number = $state(0);
	private _timeoutId: ReturnType<typeof setTimeout> | null = null;

	constructor(private onComplete: () => void) {}

	get isRunning() {
		return this._isRunning;
	}

	get remainingSeconds() {
		return this._remainingSeconds;
	}

	public start(seconds: number) {
		this.cancel();

		if (seconds <= 0) {
			return;
		}

		this._remainingSeconds = seconds;
		this._isRunning = true;

		const tick = () => {
			this._timeoutId = setTimeout(() => {
				this._remainingSeconds--;
				if (this._remainingSeconds <= 0) {
					this.cancel();
					this.onComplete();
					return;
				}
				tick();
			}, 1000);
		};

		tick();
	}

	public cancel() {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
			this._timeoutId = null;
		}
		this._remainingSeconds = 0;
		this._isRunning = false;
	}
}
