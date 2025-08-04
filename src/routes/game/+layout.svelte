<script lang="ts">
	import { buttonVariants, Button } from '$lib/components/ui/button';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { goto } from '$app/navigation';
	import { gameStore } from '$lib/stores/gameStore';
	let { children } = $props();
</script>

<div class="absolute m-2">
	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'outline' })}>
			<LogOutIcon></LogOutIcon>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Leave the game?</AlertDialog.Title>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Go back</AlertDialog.Cancel>
				<AlertDialog.Action onclick={gameStore.leaveGame}>Leave</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
{@render children()}
