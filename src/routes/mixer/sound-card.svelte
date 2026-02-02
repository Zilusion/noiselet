<script lang="ts">
	import type { AudioEngine } from '$lib/audio/audio-engine.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';

	type Props = {
		engine: AudioEngine;
		buffer: AudioBuffer | null;
		label?: string;
		channelId: string;
	};

	let { engine, buffer, label, channelId }: Props = $props();

	let channel = $derived(engine.getChannel(channelId));

	async function handlePlayClick() {
		if (!buffer) return;
		await engine.ensureRunning();
		engine.playBuffer(buffer, { channelId });
	}
</script>

<div></div>

<Card.Root class="max-w-50">
	<Card.Content>
		<form>
			<div class="flex flex-col gap-6">
				<div class="grid gap-2">
					<Label for="email">Volume</Label>
					<Slider
						bind:value={channel.volume}
						type="single"
						min={0}
						max={2}
						step={0.01}
						aria-valuetext={String(channel.volume)}
					></Slider>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex-col gap-2">
		<Button variant="outline" onclick={handlePlayClick}>Play {label} sound</Button>
	</Card.Footer>
</Card.Root>
