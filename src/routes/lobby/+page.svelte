<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import type { PageData } from '../[slug]/lobby/$types';

    let data: PageData = $props();
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Lobby</Card.Title>
			<Card.Description>Waiting for game to start</Card.Description>
		</Card.Header>
		<Card.Content>
			<Button href="/lobby">Lobby</Button>
			<Button href="/take-picture">Take Picture</Button>
		</Card.Content>
	</Card.Root>
</main>