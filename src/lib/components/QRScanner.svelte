<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import QrScanner from 'qr-scanner';

	interface Props {
		onscan?: (result: string) => void;
	}

	let { onscan }: Props = $props();
	let videoElement = $state<HTMLVideoElement>();
	let qrScanner = $state<QrScanner>();
	let isScanning = $state(false);
	let error = $state<string>('');

	onMount(async () => {
		if (!videoElement) return;

		try {
			qrScanner = new QrScanner(
				videoElement,
				(result) => {
					onscan?.(result.data);
				},
				{
					returnDetailedScanResult: true,
					highlightScanRegion: true,
					highlightCodeOutline: true
				}
			);

			await qrScanner.start();
			isScanning = true;
			error = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to start camera';
			console.error('QR Scanner error:', err);
		}
	});

	onDestroy(() => {
		qrScanner?.stop();
		qrScanner?.destroy();
	});
</script>

<main class="flex flex-col items-center gap-4 p-4">
	{#if error}
		<div class="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			Error: {error}
		</div>
	{/if}

	<div class="relative w-full max-w-sm">
		<video
			bind:this={videoElement}
			autoplay
			playsinline
			muted
			class="aspect-square w-full rounded-lg border-2 border-gray-300 object-cover"
		></video>

		{#if !isScanning && !error}
			<div
				class="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black"
			>
				<div class="text-center text-white">
					<div class="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
					<p>Starting camera...</p>
				</div>
			</div>
		{/if}
	</div>

	{#if isScanning}
		<p class="text-center text-sm text-gray-600">Point your camera at a QR code to scan</p>
	{/if}
</main>
