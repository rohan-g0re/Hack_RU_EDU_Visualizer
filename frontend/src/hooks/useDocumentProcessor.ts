import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractTextFromPdfDirectly } from '../services/ai/gemini';
import { useAppContext } from '../contexts/AppContext';
import * as pdfjsLib from 'pdfjs-dist';

declare global {
  interface Window {
    pdfjsLib: typeof pdfjsLib;
  }
}

export function useDocumentProcessor() {
  const { 
    setInputText, 
    setIsLoading, 
    setError, 
    inputText 
  } = useAppContext();
  
  const [isPdfJsLoaded, setIsPdfJsLoaded] = useState<boolean>(false);
  
  // Load PDF.js
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // Use a bundled worker from your node_modules
        const workerPath = new URL(
          'node_modules/pdfjs-dist/build/pdf.worker.mjs',
          import.meta.url
        ).toString();
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
        window.pdfjsLib = pdfjsLib;
        setIsPdfJsLoaded(true);
      } catch (error: unknown) {
        console.error('Error loading PDF.js:', error);
        setError('Failed to load PDF processor. PDF functionality may not work.');
      }
    };
    
    loadPdfJs();
  }, [setError]);

  // File drop handler
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type === 'application/pdf') {
      if (!isPdfJsLoaded) {
        setError('PDF processor is not loaded yet. Please try again in a moment.');
        return;
      }
      
      setIsLoading(true);
      setError('');
      try {
        // Use Gemini instead of Claude for PDF text extraction
        const extractedText = await extractTextFromPdfDirectly(file);
        setInputText(extractedText);
      } catch (error: any) {
        console.error('Error reading PDF:', error);
        setError(`Failed to read PDF file: ${error.message || 'Unknown error'}`);
      }
      setIsLoading(false);
    }
  };

  // URL submission handler
  const handleUrlSubmit = async () => {
    if (!inputText.startsWith('http')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsLoading(true);
    setError('');

    // List of CORS proxies to try
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/',
      'https://corsproxy.io/?'
    ];

    try {
      // Special handling for PDF files
      if (isPdfUrl(inputText)) {
        setError('PDF extraction directly from URLs requires special handling. Try one of these options:\n' +
          '1. Download the PDF and upload it using the file uploader below\n' +
          '2. Copy text from the PDF and paste it in the input field');
        setIsLoading(false);
        return;
      }

      // Try each CORS proxy until one works
      let success = false;
      let html = '';
      let proxyErrorMessages = [];

      for (const proxy of corsProxies) {
        if (success) break;
        
        try {
          const targetUrl = encodeURIComponent(inputText);
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

      // Basic HTML text extraction in the frontend
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Remove scripts, styles, and other non-content elements
      const elementsToRemove = tempDiv.querySelectorAll('script, style, iframe, nav, footer, header, aside, .sidebar, .comments, .ad, .advertisement, form');
      elementsToRemove.forEach(el => el.remove());
      
      // Extract text
      let extractedText = '';
      
      // Try to find main content containers
      const mainContent = tempDiv.querySelector('main, article, .content, #content, .main-content, #main-content, .post-content, .article-content, .entry-content');
      
      if (mainContent) {
        extractedText = mainContent.textContent || '';
      } else {
        // Fallback to body content
        extractedText = tempDiv.textContent || '';
      }
      
      // Clean the text
      extractedText = extractedText
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();
      
      if (extractedText.length > 500) {
        setInputText(extractedText);
      } else {
        throw new Error('The extracted content seems too short. The URL might be protected or require authentication.');
      }
    } catch (error: any) {
      console.error('Error scraping URL:', error);
      setError(error.message || 'Failed to fetch content from URL');
    }
    setIsLoading(false);
  };

  // Helper functions
  const isPdfUrl = (url: string) => {
    return url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('/pdf');
  };

  // Dropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return {
    isPdfJsLoaded,
    handleUrlSubmit,
    isPdfUrl,
    getRootProps,
    getInputProps,
    isDragActive
  };
} 