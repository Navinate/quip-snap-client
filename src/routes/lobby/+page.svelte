<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Lobby Page</Card.Title>
			<Card.Description>Host or Join a Lobby</Card.Description>
		</Card.Header>
		<Card.Content>
			content
		</Card.Content>
	</Card.Root>
</main>