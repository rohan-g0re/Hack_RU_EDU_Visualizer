/**
 * Text Processing Utilities
 * Functions for manipulating and processing text content
 */

/**
 * Clean text by removing extra whitespace and normalizing line breaks
 * @param text The text to clean
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

/**
 * Extract main content from HTML by removing common non-content elements
 * @param html HTML content to process
 * @returns Extracted text content
 */
export function extractTextFromHtml(html: string): string {
  // Use DOM API for reliable HTML parsing
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove scripts, styles, and other non-content elements
  const elementsToRemove = tempDiv.querySelectorAll(
    'script, style, iframe, nav, footer, header, aside, .sidebar, .comments, .ad, .advertisement, form'
  );
  elementsToRemove.forEach(el => el.remove());
  
  // Try to find main content containers
  const mainContent = tempDiv.querySelector(
    'main, article, .content, #content, .main-content, #main-content, .post-content, .article-content, .entry-content'
  );
  
  // Extract text from main content or whole body
  const extractedText = mainContent 
    ? mainContent.textContent || '' 
    : tempDiv.textContent || '';
  
  // Clean the extracted text
  return cleanText(extractedText);
}

/**
 * Process special text elements for display
 * @param text Text to process
 * @returns Processed text
 */
export function processSpecialText(text: string): string {
  if (!text) return '';
  
  // Add any specific text processing rules here
  // Example: highlight code blocks, format lists, etc.
  
  return text;
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum allowed length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
} 