<script lang="ts">
	import { onMount } from 'svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { gameStore } from '$lib/stores/gameStore';
	import { compressImage } from '$lib/helpers/image';
	import CountDownTimer from '$lib/components/CountDownTimer.svelte';

	let videoElement: HTMLVideoElement | null = null;
	let canvasElement: HTMLCanvasElement | null = null;
	let photoTaken = false;
	let stream: MediaStream | null = null;

	let capturedImage: string | null = null;

	async function startCamera() {
		if (!navigator.mediaDevices) {
			throw new Error('Camera API not supported');
		}
		const constraints = { video: { facingMode: { ideal: 'environment' } } };
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		if (videoElement) {
			videoElement.srcObject = stream;
			await videoElement.play();
		}
	}

	function takePhoto() {
		if (!videoElement || !canvasElement) return;
		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;
		const context = canvasElement.getContext('2d');
		if (!context) return;
		context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
		capturedImage = canvasElement.toDataURL('image/jpeg');
		photoTaken = true;
		stopCamera();
	}

	function retakePhoto() {
		photoTaken = false;
		capturedImage = null;
		startCamera();
	}

	async function submitPhoto() {
		if (!capturedImage) return;
		const processedImage = await compressImage(capturedImage, 0.5, 600);

		// This is exactly what gets sent to the server
		const sizeInBytes = new Blob([processedImage]).size;
		const sizeInKB = (sizeInBytes / 1024).toFixed(2);
		const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
		console.log(`Sending to server: ${sizeInBytes} bytes (${sizeInKB} KB, ${sizeInMB} MB)`);
		gameStore.sendPhoto(processedImage);
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	onMount(() => {
		startCamera();
	});
</script>

<main class="mx-2 flex min-h-screen flex-col justify-center gap-4">
	<div></div>

	<Card.Root>
		<Card.Header>
			<Card.Title class="scroll-m-20 text-2xl font-semibold tracking-tight"
				>{$gameStore.rounds[$gameStore.roundIndex].prompt}</Card.Title
			>
			<Card.Description
				><CountDownTimer initTime={$gameStore.settings.photoTime} onComplete={submitPhoto}
				></CountDownTimer></Card.Description
			>
		</Card.Header>
		<Card.Content class="flex flex-col gap-1">
			<canvas bind:this={canvasElement} style="display: none;"></canvas>
			{#if !photoTaken}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video bind:this={videoElement} autoplay playsinline class="rounded-md"></video>
				<Button onclick={takePhoto}>Take Photo</Button>
			{:else}
				{#if capturedImage}
					<!-- svelte-ignore a11y_img_redundant_alt -->
					<img src={capturedImage} alt="Captured photo" class="rounded-md" />
				{/if}
				<Button onclick={retakePhoto} class={buttonVariants({ variant: 'destructive' })}
					>Retake Photo</Button
				>
				<Button onclick={submitPhoto}>Submit Photo</Button>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
