<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	interface Props {
		text?: string;
		size?: number;
		errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
	}

	let { text, size = 200, errorCorrectionLevel = 'M' }: Props = $props();

	let canvasElement = $state<HTMLCanvasElement>();

	async function generateQRCode() {
		if (!canvasElement || !text) return;

		try {
			await QRCode.toCanvas(canvasElement, text, {
				width: size,
				errorCorrectionLevel,
				margin: 2
			});
		} catch (err) {
			console.error('Error generating QR code:', err);
		}
	}

	onMount(() => {
		generateQRCode();
	});

	$effect(() => {
		generateQRCode();
	});
</script>

<div>
	<canvas bind:this={canvasElement}></canvas>
</div>
