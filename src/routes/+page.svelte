<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { gameStore } from '$lib/stores/gameStore';
	import type { Room } from 'colyseus.js';

	let isConnecting: boolean;
	let joinCode: string = "";

	async function hostRoom() {
		isConnecting = true;
		try {
			const room  = await gameStore.createRoom();
			//console.log(`Room created with join code: ${room.roomID}`);
			console.log(room)
			goto(`lobby`);
		} catch (err) {
			console.error(err);
		} finally {
			isConnecting = false;
		}
	}

	async function joinRoom() {
		if (!joinCode.trim()) return;
		isConnecting = true;
		try {
			await gameStore.joinByCode(joinCode.trim());
			goto(`/lobby`);
		} catch (err) {
			console.error(err);
		} finally {
			isConnecting = false;
		}
	}
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Debug Index</Card.Title>
			<Card.Description>Quick navigate to app pages</Card.Description>
		</Card.Header>
		<Card.Content>
			<InputOTP.Root maxlength={9} bind:value={joinCode}>
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells as cell (cell)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
			<div class="flex justify-around w-full p-6">
			<Button onclick={joinRoom}>Join Room</Button>
			<Button onclick={hostRoom}>Host Room</Button>
			</div>
		</Card.Content>
	</Card.Root>
</main>
