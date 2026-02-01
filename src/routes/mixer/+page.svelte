<!-- src\routes\buffer\+page.svelte -->
<script lang="ts">
	import { AudioEngine } from '$lib/audio/audio-engine';
	import { getSoundUrl } from '$lib/audio/sounds';
	import { onMount } from 'svelte';

	let buffer: AudioBuffer | null = null;
	let isLoading = $state(true);
	let error: string | null = $state(null);

	onMount(async () => {
		try {
			let engine = AudioEngine.instance;
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
		let engine = AudioEngine.instance;
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
{/if}
