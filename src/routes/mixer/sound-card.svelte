<!-- src\routes\mixer\sound-card.svelte -->
<script lang="ts">
	import { mixer } from '$lib/audio/mixer.svelte';
	import type { Sound } from '$lib/audio/sound.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';

	type Props = {
		sound: Sound;
	};

	let { sound }: Props = $props();

	async function handleToggle() {
		await mixer.ensureRunning();
		sound.toggle();
	}
</script>

<Card.Root class="max-w-50">
	<Card.Header>
		<Card.Title>{sound.label}</Card.Title>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="flex flex-col gap-6">
				<div class="grid gap-2">
					<Label>Volume</Label>
					<Slider
						value={sound.volume}
						onValueChange={(v) => (sound.volume = v)}
						type="single"
						min={0}
						max={2}
						step={0.01}
						aria-valuetext={String(sound.volume)}
					></Slider>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex-col gap-2">
		<Button
			variant={sound.isPlaying ? 'default' : 'outline'}
			onclick={handleToggle}
			disabled={!sound.isLoaded}
		>
			{sound.isPlaying ? 'Stop' : 'Play'}
		</Button>
	</Card.Footer>
</Card.Root>
