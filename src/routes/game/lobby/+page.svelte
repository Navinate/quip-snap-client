<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import QRGenerator from '$lib/components/QRGenerator.svelte';
	import { GameSettings } from '$lib/schema/GameSettings';
	import type { Room } from 'colyseus.js';
	import { onMount } from 'svelte';

	let gameSettings = new GameSettings();
	gameSettings.numRounds = 3;
	gameSettings.voteTime = 300;
	gameSettings.photoTime = 120;
	
	let room: Room | null = null;

	onMount(async () => {
		room = await gameStore.getRoom();
	});

	$: lobbyID = room?.roomId ?? '';
	$: isHost = room?.sessionId === $gameStore.hostID;
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Waiting for game to start</Card.Title>
			<Card.Description>Join code: {lobbyID}</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			{#if isHost}
				<Button onclick={() => gameStore.startGame(gameSettings)}>Start Game</Button>
			{/if}
			<QRGenerator text={lobbyID} size={250} />
			<Button href="/" class={buttonVariants({ variant: 'destructive' })}>Leave Room</Button>
		</Card.Content>
	</Card.Root>
</main>
