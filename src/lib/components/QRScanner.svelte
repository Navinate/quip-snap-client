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
                const devices = await BrowserQRCodeReader.listVideoInputDevices();
                
                // Find back camera - look for 'environment' or 'back' in label
                const backCamera = devices.find(device => 
                    device.label.toLowerCase().includes('back') || 
                    device.label.toLowerCase().includes('environment')
                ) || devices[devices.length - 1]; // Fallback to last device (often back camera)
                
                const selectedDeviceId = backCamera?.deviceId || devices[0]?.deviceId;
               
                if (selectedDeviceId) {
                    controls = await qrCodeReader.decodeFromVideoDevice(
                        selectedDeviceId,
                        videoElement!,
                        (resultObj, error) => {
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