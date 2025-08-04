<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { gameStore } from '$lib/stores/gameStore';
	let { children } = $props();
	
	onMount(() => {
		gameStore.reconnect();
	})
</script>

{@render children()}
