<!-- src\routes\mixer\+page.svelte -->
<script lang="ts">
	import { getSoundConfigs } from '$lib/audio/sounds';
	import { onMount } from 'svelte';
	import SoundCard from './sound-card.svelte';
	import { Slider } from '$lib/components/ui/slider';
	import { Label } from '$lib/components/ui/label';
	import { mixer } from '$lib/audio/mixer.svelte';

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
</script>

{#if error}
	<p>{error}</p>
{:else if isLoading}
	Loading...
{:else}
	<section class="flex flex-col gap-4 p-4">
		<h1 class="text-2xl font-bold">Mixer</h1>
		<div class="grid gap-2">
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
		</div>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each mixer.sounds as sound (sound.id)}
				<SoundCard {sound} />
			{/each}
		</div>
	</section>
{/if}
