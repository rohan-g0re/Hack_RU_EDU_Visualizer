import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader } from 'lucide-react';
import { extractTextFromPdfDirectly } from '../../services/ai/gemini';
import { PdfProcessorProps } from '../../types/document.types';
import { ERROR_MESSAGES, STATUS_MESSAGES } from '../../constants/messages';
import { PDF_CONFIG } from '../../constants/config';

declare global {
  interface Window {
    pdfjsLib: typeof pdfjsLib;
  }
}

const PdfProcessor: React.FC<PdfProcessorProps> = ({
  pdfFile,
  pdfUrl,
  onTextExtracted,
  onError,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPdfJsLoaded, setIsPdfJsLoaded] = useState<boolean>(false);
  
  // Initialize PDF.js
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // Use a bundled worker from node_modules
        const workerPath = new URL(
          PDF_CONFIG.WORKER_PATH,
          import.meta.url
        ).toString();
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
        // Set global pdfjsLib for potential usage elsewhere
        window.pdfjsLib = pdfjsLib;
        setIsPdfJsLoaded(true);
      } catch (error) {
        console.error('Error loading PDF.js:', error);
        onError(ERROR_MESSAGES.PDF_LOAD_FAILED);
      }
    };
    
    loadPdfJs();
  }, [onError]);
  
  // Process PDF when file or URL changes
  useEffect(() => {
    if (!isPdfJsLoaded) return;
    
    const processPdf = async () => {
      if (!pdfFile && !pdfUrl) return;
      
      setIsLoading(true);
      onStatusChange(STATUS_MESSAGES.PROCESSING_PDF);
      
      try {
        let text = '';
        
        if (pdfFile) {
          text = await extractTextFromPdfDirectly(pdfFile);
          onStatusChange(STATUS_MESSAGES.FILE_PROCESSED(pdfFile.name));
        } else if (pdfUrl) {
          // We can add direct URL processing here in the future
          const response = await fetch(pdfUrl);
          const arrayBuffer = await response.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          const file = new File([blob], 'document.pdf', { type: 'application/pdf' });
          
          text = await extractTextFromPdfDirectly(file);
          onStatusChange(STATUS_MESSAGES.PDF_URL_PROCESSED);
        }
        
        onTextExtracted(text);
      } catch (error) {
        console.error('Error processing PDF:', error);
        onError(`${ERROR_MESSAGES.PDF_PROCESS_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    processPdf();
  }, [pdfFile, pdfUrl, isPdfJsLoaded, onTextExtracted, onError, onStatusChange]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 text-blue-500 animate-spin mb-2" />
          <p className="text-gray-600">{STATUS_MESSAGES.PROCESSING_PDF}</p>
        </div>
      </div>
    );
  }
  
  // Component is primarily functional, no need to render when not loading
  return null;
};

export default PdfProcessor; 