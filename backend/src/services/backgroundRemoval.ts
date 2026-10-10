export interface RemoveBackgroundOptions {
  format?: 'png' | 'webp';
  quality?: number;
  size?: 'auto' | 'preview' | 'full' | 'high';
}

export interface RemoveBackgroundResult {
  buffer: Buffer;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface BackgroundRemovalService {
  name: string;
  removeBackground(image: Buffer, options?: RemoveBackgroundOptions): Promise<RemoveBackgroundResult>;
}

export class RemoveBGProvider implements BackgroundRemovalService {
  name = 'removebg';

  async removeBackground(image: Buffer, options: RemoveBackgroundOptions = {}): Promise<RemoveBackgroundResult> {
    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) throw new Error('REMOVEBG_API_KEY is not configured');

    const formData = new FormData();
    formData.append('image_file', new Blob([new Uint8Array(image)], { type: 'image/png' }));
    formData.append('size', options.size || 'auto');
    if (options.format) formData.append('format', options.format);

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`remove.bg failed: ${response.status} ${errorText}`);
    }

    const resultBuffer = Buffer.from(await response.arrayBuffer());
    const mimeType = options.format === 'webp' ? 'image/webp' : 'image/png';
    return { buffer: resultBuffer, mimeType };
  }
}

export class ReplicateProvider implements BackgroundRemovalService {
  name = 'replicate';

  async removeBackground(image: Buffer, options: RemoveBackgroundOptions = {}): Promise<RemoveBackgroundResult> {
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) throw new Error('REPLICATE_API_TOKEN is not configured');

    const dataUri = `data:image/png;base64,${image.toString('base64')}`;

    const predictResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '8abf3980818e0a56a4f7bd5c7b3f7b9e0c3e7a4b9e8a7f6c5d4b3a2987fedcba',
        input: { image: dataUri },
      }),
    });

    if (!predictResponse.ok) {
      throw new Error(`Replicate prediction failed: ${predictResponse.status}`);
    }

    const prediction = await predictResponse.json();
    let outputUrl = prediction.output?.[0] || prediction.output;

    for (let i = 0; i < 60; i++) {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
      });
      const status = await statusResponse.json();
      if (status.status === 'succeeded') {
        outputUrl = status.output?.[0] || status.output;
        break;
      }
      if (status.status === 'failed') throw new Error('Replicate prediction failed');
      await new Promise(r => setTimeout(r, 1000));
    }

    const imageResponse = await fetch(outputUrl);
    const resultBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const mimeType = options.format === 'webp' ? 'image/webp' : 'image/png';
    return { buffer: resultBuffer, mimeType };
  }
}

export function createBackgroundRemovalService(): BackgroundRemovalService {
  const provider = (process.env.BACKGROUND_REMOVAL_PROVIDER || 'removebg').toLowerCase();
  switch (provider) {
    case 'replicate':
      return new ReplicateProvider();
    case 'removebg':
    default:
      return new RemoveBGProvider();
  }
}