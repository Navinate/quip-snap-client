<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { gameStore } from '$lib/stores/gameStore';
	let { children } = $props();

	onMount(async () => {
		await gameStore.reconnect();
	});
</script>

{@render children()}
