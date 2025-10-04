import * as pdfjsLib from 'pdfjs-dist';

declare global {
  interface Window {
    pdfjsLib: typeof pdfjsLib;
  }
}

export async function loadPdfLibrary(): Promise<typeof pdfjsLib> {
  try {
    // Use a bundled worker from your node_modules
    const workerPath = new URL(
      'node_modules/pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
    window.pdfjsLib = pdfjsLib;
    
    return pdfjsLib;
  } catch (error: unknown) {
    console.error('Error loading PDF.js:', error);
    throw new Error('Failed to load PDF processor');
  }
}

export async function extractImagesFromPdf(pdfFile: File): Promise<string[]> {
  try {
    // Step 1: Load the PDF using PDF.js
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);
    const loadingTask = window.pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    
    // Step 2: For each page, render it to a canvas and convert to image
    const imageDataUrls: string[] = [];
    const totalPages = pdf.numPages;
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // Get page
      const page = await pdf.getPage(pageNum);
      
      // Set scale for better resolution (higher number = better quality but larger file)
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert canvas to JPEG data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      imageDataUrls.push(imageDataUrl);
      
      // Clean up
      canvas.remove();
    }
    
    return imageDataUrls;
  } catch (error: unknown) {
    console.error('Error extracting images from PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to extract images from PDF: ${errorMessage}`);
  }
}

// URL handling helpers
export function isPdfUrl(url: string): boolean {
  return url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('/pdf');
} 