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

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>
				{#if $gameStore.roundIndex < $gameStore.rounds.length}
					Current Scores!
				{:else}
					Final Results!
				{/if}
			</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			<ol>
				{#each Array.from($gameStore.players.values()).sort((a, b) => b.score - a.score) as player}
					<li>
						<span class="bold">{player.name}</span>
						<span class="small">{player.score}</span>
					</li>
				{/each}
			</ol>
            {#if room?.sessionId === $gameStore.hostID}
                <Button onclick={gameStore.nextRound}>Next Round</Button>
            {/if}
		</Card.Content>
	</Card.Root>
</main>
