<!-- src\routes\mixer\+page.svelte -->
<script lang="ts">
	import { getSoundConfigs } from '$lib/audio/sounds';
	import { onMount } from 'svelte';
	import SoundCard from './sound-card.svelte';
	import { Slider } from '$lib/components/ui/slider';
	import { Label } from '$lib/components/ui/label';
	import { mixer } from '$lib/audio/mixer.svelte';
	import { Button } from '$lib/components/ui/button';
	import { SleepTimer } from '$lib/audio/sleep-timer.svelte';

	let isLoading = $state(true);
	let error: string | null = $state(null);

	onMount(async () => {
		try {
			await mixer.init(getSoundConfigs());
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			isLoading = false;
		}
	});

	function toggleMixerPause() {
		if (mixer.isPaused) {
			mixer.resume();
		} else {
			mixer.pause();
		}
	}

	function onTimerComplete() {
		mixer.pause();
	}

	let sleepTimer = new SleepTimer(onTimerComplete);

	function startSleepTimer() {
		if (!canStartSleepTimer) return;

		sleepTimer.start(10);
	}

	function cancelSleepTimer() {
		sleepTimer.cancel();
	}

	const canStartSleepTimer = $derived(mixer.hasActiveSounds && !mixer.isPaused);

	const shouldCancelSleepTimer = $derived(
		sleepTimer.isRunning && (mixer.isPaused || !mixer.hasActiveSounds)
	);

	$effect(() => {
		if (!shouldCancelSleepTimer) return;
		sleepTimer.cancel();
	});
</script>

{#if error}
	<p>{error}</p>
{:else if isLoading}
	Loading...
{:else}
	<section class="flex flex-col gap-4 p-4">
		<h1 class="text-2xl font-bold">Mixer</h1>
		<div class="grid gap-2">
			{#if mixer.hasActiveSounds || mixer.isPaused}
				<Button onclick={toggleMixerPause}>{mixer.isPaused ? 'Resume' : 'Pause'}</Button>
			{/if}
			<Label>Master Volume</Label>
			<Slider
				type="single"
				value={mixer.masterVolume}
				onValueChange={(v) => (mixer.masterVolume = v)}
				min={0}
				max={2}
				step={0.01}
				aria-valuetext={String(mixer.masterVolume)}
			></Slider>
			<div class="flex gap-2">
				<Button
					variant="outline"
					class="w-40"
					onclick={startSleepTimer}
					disabled={!canStartSleepTimer}
				>
					{sleepTimer.isRunning ? 'Reset sleep timer' : 'Sleep in 10 seconds'}
				</Button>
				{#if sleepTimer.isRunning}
					<Button variant="outline" class="w-40" onclick={cancelSleepTimer}>
						Cancel sleep timer
					</Button>
					<p>Sleep timer: {sleepTimer.remainingSeconds}s left</p>
				{/if}
			</div>
		</div>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each mixer.sounds as sound (sound.id)}
				<SoundCard {sound} />
			{/each}
		</div>
	</section>
{/if}
