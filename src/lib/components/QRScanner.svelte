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
                    highlightCodeOutline: true,
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
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
        </div>
    {/if}

    <div class="relative w-full max-w-sm">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video 
            bind:this={videoElement} 
            autoplay 
            playsinline 
            muted
            class="w-full aspect-square object-cover rounded-lg border-2 border-gray-300"
        ></video>
        
        {#if !isScanning && !error}
            <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div class="text-white text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Starting camera...</p>
                </div>
            </div>
        {/if}
    </div>

    {#if isScanning}
        <p class="text-sm text-gray-600 text-center">
            Point your camera at a QR code to scan
        </p>
    {/if}
</main>