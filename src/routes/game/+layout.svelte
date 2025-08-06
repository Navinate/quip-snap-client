<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import LogOutIcon from '@lucide/svelte/icons/door-open';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import { onMount } from 'svelte';
	let { children } = $props();
	onMount(() => {
		//TODO: put game sync / status check here
	});
</script>

<div class="absolute m-2">
	<AlertDialog.Root>
		<AlertDialog.Trigger class="{buttonVariants({ variant: 'destructive' })}} h-12 w-12">
			<LogOutIcon class="!h-8 !w-8" />
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Leave the game?</AlertDialog.Title>
			</AlertDialog.Header>
			<AlertDialog.Footer class="grid grid-cols-2">
				<AlertDialog.Cancel class="grow">Go back</AlertDialog.Cancel>
				<AlertDialog.Action
					class="grow {buttonVariants({ variant: 'destructive' })}"
					onclick={gameStore.leaveGame}>Leave</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
{@render children()}
