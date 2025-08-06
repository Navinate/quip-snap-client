<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import type { Room } from 'colyseus.js';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	let room: Room | null = null;
	onMount(async () => {
		room = await gameStore.getRoom();
	});
</script>

<main class="flex min-h-screen items-center justify-center p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<Card.Title class="text-2xl font-bold">
				{#if $gameStore.roundIndex < $gameStore.rounds.length}
					🏆 Current Scores
				{:else}
					🎉 Final Results
				{/if}
			</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="space-y-3">
				{#each Array.from($gameStore.players.values()).sort((a, b) => b.score - a.score) as player, index (player.name)}
					<div
						class="flex items-center justify-between rounded-lg border-2 p-3 {index === 0
							? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50'
							: 'border-gray-200 bg-gray-50'}"
					>
						<div class="flex items-center gap-3">
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full {index === 0
									? 'bg-yellow-400 text-yellow-900'
									: index === 1
										? 'bg-gray-300 text-gray-700'
										: index === 2
											? 'bg-orange-300 text-orange-800'
											: 'bg-gray-200 text-gray-600'} text-sm font-bold"
							>
								#{index + 1}
							</span>
							<span class="text-lg font-semibold">{player.name}</span>
						</div>
						<span class="text-xl font-bold {index === 0 ? 'text-yellow-600' : 'text-gray-700'}"
							>{player.score}</span
						>
					</div>
				{/each}
			</div>
			{#if room?.sessionId === $gameStore.hostID && $gameStore.roundIndex < $gameStore.settings.numRounds}
				<Button class="w-full" onclick={gameStore.nextRound}>Next Round</Button>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
