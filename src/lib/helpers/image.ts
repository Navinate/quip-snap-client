export async function compressImage(
	dataUrl: string,
	quality: number = 0.7,
	maxWidth: number = 800
): Promise<string> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d')!;

			// Calculate new dimensions
			const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
			canvas.width = img.width * ratio;
			canvas.height = img.height * ratio;

			// Draw and compress
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			resolve(canvas.toDataURL('image/webp', quality));
		};
		img.src = dataUrl;
	});
}

export function uint8ArrayToDataURL(uint8Array: Uint8Array): string {
	const blob = new Blob([uint8Array], { type: 'image/webp' });
	return URL.createObjectURL(blob);
}
