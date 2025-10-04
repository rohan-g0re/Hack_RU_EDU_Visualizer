/**
 * File Handling Utilities
 * Functions for processing different file types
 */

/**
 * Read text file content
 * @param file Text file to read
 * @returns Promise resolving to the file content as string
 */
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Convert ArrayBuffer to Base64 string
 * @param buffer ArrayBuffer to convert
 * @returns Base64 encoded string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return window.btoa(binary);
}

/**
 * Get file extension from file name
 * @param fileName Name of the file
 * @returns File extension (lowercase, without the dot)
 */
export function getFileExtension(fileName: string): string {
  if (!fileName) return '';
  
  const parts = fileName.split('.');
  if (parts.length === 1) return ''; // No extension
  
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Check if a file is a supported document format
 * @param file File to check
 * @returns Boolean indicating if the file is a supported document
 */
export function isSupportedDocumentType(file: File): boolean {
  if (!file) return false;
  
  const supportedTypes = [
    'application/pdf', 
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const extension = getFileExtension(file.name);
  const supportedExtensions = ['pdf', 'txt', 'md', 'doc', 'docx'];
  
  return supportedTypes.includes(file.type) || supportedExtensions.includes(extension);
} 