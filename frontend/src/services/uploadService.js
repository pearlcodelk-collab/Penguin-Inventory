import api from './api';

// Upload file to Cloudinary.
// Strategy:
// 1) If Vite env has Cloudinary config, upload DIRECTLY to Cloudinary (unsigned preset).
// 2) Otherwise, fallback to backend /api/uploads/image (which streams to Cloudinary, no local storage).
export const uploadImage = async (file) => {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME || env.VITE_CLOUDINARY_NAME || '';
  const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET || env.VITE_UPLOAD_PRESET || '';

  if (cloudName && uploadPreset) {
    // Direct unsigned upload to Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);
    form.append('folder', 'items');
    const res = await fetch(url, { method: 'POST', body: form });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Cloudinary upload failed');
    }
    return await res.json();
  }

  // Fallback: use backend endpoint that streams to Cloudinary (no disk write)
  const form = new FormData();
  form.append('image', file);
  const res = await api.post('/uploads/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // Normalize to a Cloudinary-like shape
  const data = res.data || {};
  return {
    secure_url: data.url,
    url: data.url,
    public_id: data.publicId,
    width: data.width,
    height: data.height,
    format: data.format,
  };
};


