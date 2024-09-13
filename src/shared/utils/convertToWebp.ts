import imageCompression from "browser-image-compression";

/**
 * Compresses an image file and converts it to WebP in the browser.
 * @param file - The image file to compress.
 * @returns A promise that resolves to a Blob of the compressed image.
 */
export async function convertToWebp(
  file: File,
  quality: number = 80,
): Promise<Blob> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp", // Convert to WebP format
    initialQuality: quality / 100,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    throw new Error("Image compression failed");
  }
}
