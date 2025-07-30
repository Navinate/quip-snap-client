<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button/Button.svelte';

	let videoElement: HTMLVideoElement | null = null;
	let canvasElement: HTMLCanvasElement | null = null;
	let photoTaken = false;
	let stream: MediaStream | null = null;

	let capturedImage: string | null = null;

	async function startCamera() {
		if (!navigator.mediaDevices) {
			throw new Error('Camera API not supported');
		}
		stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
		capturedImage = canvasElement.toDataURL('image/png');
		photoTaken = true;

		stopCamera();
	}

	function retakePhoto() {
		photoTaken = false;
		capturedImage = null;
		startCamera();
	}

	function submitPhoto() {

	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	onMount(()=> {
		startCamera();
	})
</script>

<main class="flex min-h-screen flex-col items-center justify-center">
	{#if !photoTaken}
		<!-- svelte-ignore a11y_media_has_caption -->
		<video bind:this={videoElement} autoplay playsinline></video>
		<Button onclick={takePhoto}>Take Photo</Button>
	{:else}
		{#if capturedImage}
			<!-- svelte-ignore a11y_img_redundant_alt -->
			<img src={capturedImage} alt="Captured photo" />
		{/if}
		<Button onclick={retakePhoto}>Retake Photo</Button>
		<Button onclick={submitPhoto}>Submit Photo</Button>
	{/if}
	<canvas bind:this={canvasElement} style="display: none;"></canvas>
</main>
