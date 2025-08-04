<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import type { GameSettings } from '$lib/stores/gameStore';
	import { get } from 'svelte/store';
	import QRGenerator from '$lib/components/QRGenerator.svelte';
	const currentState = get(gameStore);
	const lobbyID = currentState.room?.roomId || '';

	let gameSettings: GameSettings = {
		numRounds: 3,
		votingTime: 300,
		photoTime: 300,
	};
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Waiting for game to start</Card.Title>
			<Card.Description>Join code: {lobbyID}</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			{#if currentState.isHost}
				<Button onclick={() => gameStore.startGame(gameSettings)}>Start Game</Button>
			{/if}
			<QRGenerator text={lobbyID} size={250} />
			<Button href="/">Leave Room</Button>
		</Card.Content>
	</Card.Root>
</main>
