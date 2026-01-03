import {
  argbFromRgb,
  QuantizerCelebi,
  Score,
} from '@material/material-color-utilities'

/**
 * Fetches image data from a given Blob (image).
 * @param blob The Blob object containing image data.
 * @returns Uint8ClampedArray containing pixel data.
 */
const getImageData = async (blob: Blob): Promise<Uint8ClampedArray> => {
  const bitmap = await createImageBitmap(blob)

  const { width, height } = bitmap

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas.')
  }

  ctx.drawImage(bitmap, 0, 0)
  return ctx.getImageData(0, 0, width, height).data
}

/**
 * Extracts a color from an image Blob, specifically the dominant color.
 * @param blob The Blob object containing image data.
 * @returns The dominant color as a 32-bit ARGB integer, or undefined if it fails.
 */
export const extractColorFromImage = async (
  blob: Blob
): Promise<number | undefined> => {
  // Check for OffscreenCanvas support in the current environment.
  if (typeof OffscreenCanvas === 'undefined') {
    console.warn('OffscreenCanvas is not supported in this environment.')
    return undefined
  }

  try {
    const imageBytes = await getImageData(blob)

    // Convert the image data to ARGB format
    const pixels: number[] = []
    for (let i = 0; i < imageBytes.length; i += 4) {
      const r = imageBytes[i]
      const g = imageBytes[i + 1]
      const b = imageBytes[i + 2]
      const a = imageBytes[i + 3]
      if (a >= 255) {
        const argb = argbFromRgb(r, g, b)
        pixels.push(argb)
      }
    }

    // Quantize the pixel data and find the dominant color using the Material Color Utilities.
    const result = QuantizerCelebi.quantize(pixels, 128)
    const ranked = Score.score(result)
    const top = ranked[0]

    return top
  } catch (err) {
    console.error('Error extracting color from image:', err)
  }

  return undefined
}
