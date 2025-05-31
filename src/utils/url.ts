import { nanoid } from 'nanoid';

export function generateUrlId(length: number = 7): string {
  return nanoid(length);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractUrlMetadata(url: string) {
  // In a real app, this would fetch the URL and extract title/description
  // For now, we'll just return the URL as the title
  return {
    title: url,
    description: ''
  };
}
