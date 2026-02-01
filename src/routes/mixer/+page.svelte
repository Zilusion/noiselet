<!-- src\routes\mixer\+page.svelte -->
<script lang="ts">
	import { AudioEngine } from '$lib/audio/audio-engine.svelte';
	import { getSoundUrl } from '$lib/audio/sounds';
	import { onMount } from 'svelte';

	const engine = AudioEngine.instance;

	let buffer: AudioBuffer | null = null;
	let isLoading = $state(true);
	let error: string | null = $state(null);

	onMount(async () => {
		try {
			const url = getSoundUrl('rain');
			buffer = await engine.loadBuffer(url);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			isLoading = false;
		}
	});

	async function handlePlayClick() {
		if (!buffer) return;
		await engine.ensureRunning();
		engine.playBuffer(buffer);
	}
</script>

{#if error}
	<p>{error}</p>
{:else if isLoading}
	Loading...
{:else}
	<button onclick={handlePlayClick}>Play rain sound</button>
	<input
		bind:value={engine.masterVolume}
		type="range"
		name="master"
		id="master"
		min="0"
		max="2"
		step="0.01"
		aria-valuetext={String(engine.masterVolume)}
	/>
{/if}
