/**
 * resolveImageUrl — Convert various Google Drive share URL formats to a
 * directly embeddable image URL. Falls back to the original URL if it is not
 * a Google Drive link.
 *
 * Supported input patterns:
 *   https://drive.google.com/file/d/FILE_ID/view?...
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID (already a direct link variant)
 *
 * Output:
 *   https://lh3.googleusercontent.com/d/FILE_ID
 *   (works without login, respects "anyone with the link can view" sharing)
 */
import { API_BASE_URL } from '@/config';

// Clean root server origin host (e.g. "http://localhost:5001" or "https://hocmeo.io.vn")
// Strips any /api or /api/v1 suffix from API_BASE_URL.
const SERVER_ORIGIN = (API_BASE_URL || 'http://localhost:5001')
  .replace(/\/api(?:\/v\d+)?\/?$/i, '')
  .replace(/\/+$/, '');

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID/view or /file/d/FILE_ID/preview
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }

  // Pattern 2: open?id=FILE_ID or uc?id=FILE_ID or uc?export=view&id=FILE_ID
  const idMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?.*?id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // Pattern 3: thumbnail?id=FILE_ID (sometimes used in embeds)
  const thumbMatch = trimmed.match(/drive\.google\.com\/thumbnail\?.*?id=([a-zA-Z0-9_-]+)/);
  if (thumbMatch) {
    return `https://lh3.googleusercontent.com/d/${thumbMatch[1]}`;
  }

  // Pattern 4: Relative path starting with /upload/ or upload/
  if (trimmed.startsWith('/upload/') || trimmed.startsWith('upload/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${SERVER_ORIGIN}${cleanPath}`;
  }

  // Not a Google Drive or relative URL — return as-is
  return trimmed;
}


