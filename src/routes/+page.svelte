<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Debug Index</Card.Title>
			<Card.Description>Quick navigate to app pages</Card.Description>
		</Card.Header>
		<Card.Content>
			<Button href="/lobby">Lobby</Button>
			<Button href="/take-picture">Take Picture</Button>
		</Card.Content>
	</Card.Root>
</main>
