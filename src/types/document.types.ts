/**
 * Type definitions for document processing
 */

/**
 * Supported document types
 */
export type DocumentType = 'pdf' | 'text' | 'url' | 'markdown';

/**
 * Document file object with metadata
 */
export interface DocumentFile {
  name: string;
  type: DocumentType;
  size: number;
  content: string;
  fileObject?: File;
}

/**
 * Properties for document uploader component
 */
export interface DocumentUploaderProps {
  onTextExtracted: (text: string, fileName: string) => void;
  onError: (error: string) => void;
  onStatusChange: (message: string) => void;
  isPdfJsLoaded: boolean;
  className?: string;
}

/**
 * Properties for PDF processor component
 */
export interface PdfProcessorProps {
  pdfFile?: File;
  pdfUrl?: string;
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
  onStatusChange: (message: string) => void;
}

/**
 * Properties for text formatter component
 */
export interface TextFormatterProps {
  text: string;
  formattedText: string;
  onFormattedTextChange: (text: string) => void;
  onError: (error: string) => void;
  className?: string;
} 