/**
 * SVG Helper Utilities
 * Functions for SVG generation and manipulation
 */

/**
 * Sanitize SVG code to ensure it has necessary attributes
 * @param svgCode Raw SVG code
 * @returns Sanitized SVG code with necessary attributes
 */
export function sanitizeSvgCode(svgCode: string): string {
  if (!svgCode || !svgCode.includes('<svg')) {
    return svgCode;
  }
  
  let cleanedSvg = svgCode;
  
  // Add viewBox if missing
  if (!cleanedSvg.includes('viewBox')) {
    cleanedSvg = cleanedSvg.replace('<svg', '<svg viewBox="0 0 800 600"');
  }
  
  // Ensure there's a width and height
  if (!cleanedSvg.includes('width=')) {
    cleanedSvg = cleanedSvg.replace('<svg', '<svg width="100%"');
  }
  
  if (!cleanedSvg.includes('height=')) {
    cleanedSvg = cleanedSvg.replace('<svg', '<svg height="100%"');
  }
  
  return cleanedSvg;
}

/**
 * Extract SVG code from a response that might include other text
 * @param response Raw response text that may contain SVG
 * @returns The extracted SVG code or empty string if not found
 */
export function extractSvgFromResponse(response: string): string {
  if (!response) return '';
  
  // Try to extract the SVG using regex
  const svgMatch = response.match(/<svg[\s\S]*<\/svg>/);
  if (!svgMatch) return '';
  
  return sanitizeSvgCode(svgMatch[0]);
}

/**
 * Create a placeholder SVG for when generation fails
 * @param message Message to display in the placeholder
 * @returns SVG code for the placeholder
 */
export function createPlaceholderSvg(message: string = 'No visualization available'): string {
  return `<svg width="100%" height="100%" viewBox="0 0 800 600">
    <rect width="100%" height="100%" fill="#0A192F" rx="8" ry="8" />
    <text 
      x="400" 
      y="300" 
      font-family="system-ui, sans-serif" 
      font-size="24" 
      text-anchor="middle" 
      fill="#E5E7EB"
    >
      ${message}
    </text>
  </svg>`;
} 