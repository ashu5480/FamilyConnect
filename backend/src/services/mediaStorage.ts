import { put, del } from '@vercel/blob';
import { v2 as cloudinary } from 'cloudinary';

export type StorageProvider = 'vercel-blob' | 'cloudinary' | 's3';

export interface UploadResult {
  url: string;
  provider: StorageProvider;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface MediaStorageService {
  upload(file: Buffer | Blob, filename: string, mimeType: string): Promise<UploadResult>;
  delete(url: string): Promise<void>;
  getSignedUrl(url: string, expiresIn?: number): Promise<string>;
}

export class VercelBlobStorage implements MediaStorageService {
  provider: StorageProvider = 'vercel-blob';

  async upload(file: Buffer | Blob, filename: string, mimeType: string): Promise<UploadResult> {
    const blob = await put(filename, file as any, {
      access: 'public',
      contentType: mimeType,
    });
    return { url: blob.url, provider: this.provider, size: 0, mimeType };
  }

  async delete(url: string): Promise<void> {
    await del(url);
  }

  async getSignedUrl(url: string): Promise<string> {
    return url;
  }
}

export class CloudinaryStorage implements MediaStorageService {
  provider: StorageProvider = 'cloudinary';

  async upload(file: Buffer | Blob, filename: string, mimeType: string): Promise<UploadResult> {
    const dataUri = `data:${mimeType};base64,${Buffer.from(file as any).toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: filename.replace(/\.[^/.]+$/, ''),
      resource_type: 'auto',
    });
    return {
      url: result.secure_url,
      provider: this.provider,
      size: result.bytes,
      mimeType: result.format ? `image/${result.format}` : mimeType,
      width: result.width,
      height: result.height,
    };
  }

  async delete(url: string): Promise<void> {
    const publicId = url.split('/').pop()?.split('.')[0];
    if (publicId) await cloudinary.uploader.destroy(publicId);
  }

  async getSignedUrl(url: string): Promise<string> {
    return cloudinary.url(url, { secure: true });
  }
}

export function createMediaStorage(): MediaStorageService {
  const provider = (process.env.BLOB_STORAGE_PROVIDER || 'vercel-blob') as StorageProvider;
  if (provider === 'cloudinary') return new CloudinaryStorage();
  return new VercelBlobStorage();
}