<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import ScanQRCode from '@lucide/svelte/icons/scan-qr-code';
	import QRScanner from '$lib/components/QRScanner.svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { placeHolderNames } from '$lib/helpers/constants';

	const currentState = get(gameStore);

	let randomName: string = '';
	let isConnecting: boolean;
	let joinCode: string = '';
	let name: string = '';

	async function hostRoom() {
		if (name) {
			isConnecting = true;
			try {
				const room = await gameStore.createRoom(name);

				//console.log(`Room created with join code: ${room.roomID}`);
				console.log(room);
				goto(`/lobby`);
			} catch (err) {
				console.error(err);
			} finally {
				isConnecting = false;
			}
		} else {
			alert("Please enter a name")
		}
	}

	async function joinRoom() {
		if (joinCode && /^\d{6}$/.test(joinCode) && name) {
			isConnecting = true;
			try {
				await gameStore.joinByCode(joinCode.trim(), name.trim());
				goto(`/lobby`);
			} catch (err) {
				console.error(err);
				alert("cannot find room, please try another code")
			} finally {
				isConnecting = false;
			}
		} else {
			if (!joinCode) alert('no code entered');
			else if(!name) alert('please enter a name');
			else alert("bad code");
		}
	}

	onMount(() => {
		randomName = placeHolderNames[Math.floor(Math.random() * placeHolderNames.length)];
		if (currentState.room !== null) {
			gameStore.disconnect();
		}
	});
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header class="flex justify-between">
			<Card.Title>Trey's Scavenge Game</Card.Title>
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
					<ScanQRCode />
				</Dialog.Trigger>
				<Dialog.Content>
					<QRScanner
						onscan={(result) => {
							joinCode = result;
							joinRoom();
						}}
					/>
				</Dialog.Content>
			</Dialog.Root>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="nameInput">Name</Label>
				<Input id="nameInput" type="name" bind:value={name} placeholder={randomName} />
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="joinCodeInput">Join Code</Label>
				<InputOTP.Root maxlength={6} id="joinCodeInput" bind:value={joinCode}>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Button onclick={joinRoom}>Join room</Button>
				<Button onclick={hostRoom}>Or create a new room</Button>
			</div>
		</Card.Content>
	</Card.Root>
</main>
