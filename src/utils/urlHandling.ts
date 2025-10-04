/**
 * URL Handling Utilities
 * Functions for validating and processing URLs
 */

import { extractTextFromHtml } from './textProcessing';

// List of CORS proxies to try
export const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://corsproxy.io/?'
];

/**
 * Check if a string is a valid URL
 * @param url String to validate as URL
 * @returns Boolean indicating if the string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    // Add http:// prefix if missing for the URL constructor
    const urlString = url.startsWith('http') ? url : `http://${url}`;
    const urlObj = new URL(urlString);
    return !!urlObj.hostname;
  } catch (error) {
    return false;
  }
}

/**
 * Check if a URL points to a PDF file
 * @param url URL to check
 * @returns Boolean indicating if the URL points to a PDF
 */
export function isPdfUrl(url: string): boolean {
  if (!url) return false;
  
  const lowerUrl = url.toLowerCase();
  return lowerUrl.endsWith('.pdf') || 
         lowerUrl.includes('/pdf') || 
         lowerUrl.includes('application/pdf');
}

/**
 * Fetch content from a URL using CORS proxies
 * @param url URL to fetch content from
 * @returns Promise resolving to the fetched text content
 */
export async function fetchUrlContent(url: string): Promise<string> {
  if (!isValidUrl(url)) {
    throw new Error('Please enter a valid URL starting with http:// or https://');
  }
  
  // Special handling for PDF URLs
  if (isPdfUrl(url)) {
    throw new Error('PDF extraction directly from URLs requires special handling. Try one of these options:\n' +
      '1. Download the PDF and upload it using the file uploader\n' +
      '2. Copy text from the PDF and paste it in the input field');
  }
  
  // Try each CORS proxy until one works
  let success = false;
  let html = '';
  let proxyErrorMessages: string[] = [];
  
  for (const proxy of CORS_PROXIES) {
    if (success) break;
    
    try {
      const targetUrl = encodeURIComponent(url);
      const response = await fetch(`${proxy}${targetUrl}`, {
        // Add timeout to prevent long waits
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });
      
      if (response.ok) {
        // Check content type to ensure it's HTML
        const contentType = response.headers.get('content-type');
        if (contentType && (contentType.includes('text/html') || contentType.includes('application/xhtml+xml'))) {
          html = await response.text();
          success = true;
        } else if (contentType && contentType.includes('application/pdf')) {
          proxyErrorMessages.push(`URL is a PDF (detected from ${proxy})`);
          continue;
        } else {
          proxyErrorMessages.push(`Unexpected content type: ${contentType} from ${proxy}`);
          continue;
        }
      } else {
        proxyErrorMessages.push(`${proxy} returned: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      proxyErrorMessages.push(`${proxy} error: ${error.message}`);
    }
  }
  
  if (!success) {
    throw new Error(`Failed to fetch content with all proxies. Errors:\n${proxyErrorMessages.join('\n')}`);
  }
  
  // Extract text from HTML
  const extractedText = extractTextFromHtml(html);
  
  if (extractedText.length < 500) {
    throw new Error('The extracted content seems too short. The URL might be protected or require authentication.');
  }
  
  return extractedText;
} 