<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import { uint8ArrayToDataURL } from '$lib/helpers/image';

	$: votingPhotos = $gameStore.votingPhotos || [];
	let selectedPhoto: string | null = null;
</script>

<main class="mx-4 flex min-h-screen flex-col justify-center gap-4">
	<div
		class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:gap-4"
	>
		{#each votingPhotos as photo, index}
			<button
				class="aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all {selectedPhoto ===
				photo.name
					? 'border-primary ring-2 ring-primary/20'
					: 'border-border hover:border-primary/50'}"
				on:click={() => (selectedPhoto = photo.name)}
				type="button"
			>
				<img
					src={uint8ArrayToDataURL(photo.image)}
					alt={photo.name}
					class="h-full w-full object-cover"
				/>
			</button>
		{/each}
	</div>
	<Button>Submit Vote!</Button>
</main>
