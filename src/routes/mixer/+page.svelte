<!-- src\routes\buffer\+page.svelte -->
<script lang="ts">
	import { AudioEngine } from '$lib/audio/audio-engine';
	import { getSoundUrl } from '$lib/audio/sounds';
	import { onMount } from 'svelte';

	let buffer: AudioBuffer | null = null;
	let isLoading = $state(true);
	let error: string | null = $state(null);

	let masterVolume: number = $state(1);

	onMount(async () => {
		try {
			let engine = AudioEngine.instance;
			const url = getSoundUrl('rain');
			buffer = await engine.loadBuffer(url);
			masterVolume = engine.masterVolume;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			isLoading = false;
		}
	});

	async function handlePlayClick() {
		if (!buffer) return;
		let engine = AudioEngine.instance;
		await engine.ensureRunning();
		engine.playBuffer(buffer);
	}

	$effect(() => {
		let engine = AudioEngine.instance;
		engine.setMasterVolume(masterVolume);
	});
</script>

{#if error}
	<p>{error}</p>
{:else if isLoading}
	Loading...
{:else}
	<button onclick={handlePlayClick}>Play rain sound</button>
	<input
		bind:value={masterVolume}
		type="range"
		name="master"
		id="master"
		min="0"
		max="2"
		step="0.01"
		aria-valuetext={String(masterVolume)}
	/>
{/if}
