<script lang="ts">
	import CountDownTimer from '$lib/components/CountDownTimer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { gameStore } from '$lib/stores/gameStore';
	import type { Room } from 'colyseus.js';
	import { onMount } from 'svelte';
	const currentRound = $derived($gameStore.rounds[$gameStore.roundIndex]);
	const votingPhotos = $derived(currentRound?.photos);
	let selectedPhotoIndex = $state<number | null>(null);
	let voted = $state<boolean>(false);
	let room = $state<Room | null>(null);
	onMount(async () => {
		room = await gameStore.getRoom();
	});
	const currentPlayerID = $derived(room?.sessionId ?? '');
	function submitVote() {
		if (selectedPhotoIndex !== null) {
			gameStore.submitVote(votingPhotos[selectedPhotoIndex].playerID);
			voted = true;
		}
	}

	function getPlayerName(playerID: string): string {
		const p = $gameStore.players.get(playerID);
		return p ? p.name : '';
	}
</script>

<main class="flex min-h-screen flex-col gap-4 p-3">
	<div class="pt-safe mt-8 text-center">
		<h1 class="mb-1 text-xl font-bold sm:text-2xl">📸 Vote for Your Favorite</h1>
		<p class="text-sm text-muted-foreground">Choose the photo that best captures the prompt</p>
	</div>

	<div class="flex justify-center">
		<CountDownTimer initTime={$gameStore.settings.voteTime} onComplete={submitVote} />
	</div>

	<div class="min-h-80 overflow-y-auto px-4">
		<div class="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:gap-4">
			{#each votingPhotos || [] as photo, index (photo.playerID)}
				<div
					class="cursor-pointer overflow-hidden transition-all duration-200 active:scale-95
                        {photo.playerID === currentPlayerID ? 'hidden' : ''}"
				>
					<button
						class="relative h-full w-full"
						onclick={() => (selectedPhotoIndex = index)}
						type="button"
					>
						<div class="relative aspect-square overflow-hidden">
							<img
								src={photo.filePath}
								alt="Player submission"
								class="h-full w-full rounded-lg object-cover"
							/>
							{#if selectedPhotoIndex === index}
								<div
									class="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/20"
								>
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
									>
										✓
									</div>
								</div>
							{/if}
							<div class="absolute right-0 bottom-0 left-0 rounded-lg bg-black/60 p-2 text-white">
								<p class="truncate text-center text-xs font-medium sm:text-sm">
									{getPlayerName(photo.playerID)}
								</p>
							</div>
						</div>
					</button>
				</div>
			{/each}
		</div>
	</div>

	<div>
		{#if !voted}
			<Button
				class="w-full py-4 text-base font-semibold"
				disabled={selectedPhotoIndex === null}
				onclick={submitVote}
			>
				🗳️ Submit Vote
			</Button>
		{:else}
			<Button class="w-full py-4 text-base font-semibold" disabled>✅ Vote Submitted!</Button>
		{/if}
	</div>
</main>
