<!-- src\routes\mixer\+page.svelte -->
<script lang="ts">
	import { AudioEngine } from '$lib/audio/audio-engine.svelte';
	import { getSoundUrl } from '$lib/audio/sounds';
	import { onMount } from 'svelte';
	import SoundCard from './sound-card.svelte';
	import { Slider } from '$lib/components/ui/slider';

	const engine = AudioEngine.instance;

	let buffer: AudioBuffer | null = $state(null);
	let isLoading = $state(true);
	let error: string | null = $state(null);

	onMount(async () => {
		try {
			const url = getSoundUrl('rain');
			buffer = await engine.loadBuffer(url);
			engine.createChannel('rain', { initialVolume: 1 });
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			isLoading = false;
		}
	});
</script>

{#if error}
	<p>{error}</p>
{:else if isLoading}
	Loading...
{:else}
	<section class="flex flex-col gap-4 p-4">
		<h1 class="text-2xl font-bold">Mixer</h1>
		<Slider
			type="single"
			bind:value={engine.masterVolume}
			min={0}
			max={2}
			step={0.01}
			aria-valuetext={String(engine.masterVolume)}
		></Slider>
		<SoundCard {engine} {buffer} label="rain" channelId="rain" />
	</section>
{/if}
