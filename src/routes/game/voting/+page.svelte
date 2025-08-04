<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import { get } from 'svelte/store';
	const currentState = get(gameStore);
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Voting Time!</Card.Title>
			<Card.Description>Please select your favorite photo!</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			<Button href="/">Leave Room</Button>
		</Card.Content>
	</Card.Root>
</main>