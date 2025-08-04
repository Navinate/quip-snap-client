<script lang="ts">
    import { onMount } from 'svelte';
    import { BrowserQRCodeReader } from '@zxing/browser';
    import type { IScannerControls } from '@zxing/browser';

    interface Props {
        onscan?: (result: string) => void;
    }

    let { onscan }: Props = $props();

    let videoElement = $state<HTMLVideoElement>();
    let qrCodeReader: BrowserQRCodeReader;
    let controls: IScannerControls;

    onMount(() => {
        qrCodeReader = new BrowserQRCodeReader();
        
        (async () => {
            try {
                // Request camera permission and immediately stop the stream
                const permissionStream = await navigator.mediaDevices.getUserMedia({ video: true });
                permissionStream.getTracks().forEach(track => track.stop());
                
                const devices = await BrowserQRCodeReader.listVideoInputDevices();
                const selectedDeviceId = devices[0]?.deviceId;
                
                if (selectedDeviceId) {
                    qrCodeReader.decodeFromVideoDevice(
                        selectedDeviceId,
                        videoElement!,
                        (resultObj, error, ctrl) => {
                            controls = ctrl;
                            if (resultObj) {
                                const result = resultObj.getText();
                                console.log('QR Code Result:', result);
                                onscan?.(result);
                                controls.stop();
                            }
                        }
                    );
                } else {
                    console.warn('No video input devices found.');
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
            }
        })();

        return () => {
            controls?.stop();
        };
    });
</script>

<main>
    <!-- svelte-ignore a11y_media_has_caption -->
    <video bind:this={videoElement} autoplay playsinline></video>
</main>

<style>
    video {
        width: 100%;
        max-width: 400px;
        border: 1px solid #ccc;
        margin-bottom: 1em;
    }
</style>