import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X } from 'lucide-react';
import { extractTextFromPdfDirectly } from '../../services/ai/gemini';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useAppContext } from '../../contexts/AppContext';
import { DocumentUploaderProps } from '../../types/document.types';
import { readTextFile, isSupportedDocumentType } from '../../utils/fileHandling';
import { ERROR_MESSAGES, STATUS_MESSAGES, PLACEHOLDERS } from '../../constants/messages';

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onTextExtracted,
  onError,
  onStatusChange,
  isPdfJsLoaded,
  className = '',
}) => {
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFileName(file.name);
    setIsLoading(true);
    onStatusChange(`Processing ${file.name}...`);
    
    try {
      let text = '';
      
      // Handle PDF files
      if (file.type === 'application/pdf') {
        if (!isPdfJsLoaded) {
          throw new Error(ERROR_MESSAGES.PDF_LOAD_FAILED);
        }
        
        text = await extractTextFromPdfDirectly(file);
      } else {
        // Handle text files
        text = await readTextFile(file);
      }
      
      onTextExtracted(text, file.name);
      onStatusChange(STATUS_MESSAGES.FILE_PROCESSED(file.name));
    } catch (error) {
      console.error('Error processing file:', error);
      onError(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [isPdfJsLoaded, onTextExtracted, onError, onStatusChange]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });
  
  const handleClearFile = () => {
    setFileName('');
    onTextExtracted('', '');
  };
  
  return (
    <div className={`${className}`}>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-4">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Spinner size="md" color="primary" className="mb-3" />
              <p className="text-sm text-gray-600">Processing file...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-500 mb-2" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? PLACEHOLDERS.FILE_DROP_ACTIVE
                  : PLACEHOLDERS.FILE_DROP}
              </p>
              <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, TXT, MD, DOC, DOCX</p>
            </>
          )}
        </div>
      </div>
      
      {fileName && (
        <div className="flex items-center justify-between mt-2 p-2 bg-gray-100 rounded">
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700 truncate">{fileName}</span>
          </div>
          <button 
            onClick={handleClearFile}
            className="text-gray-500 hover:text-red-500"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader; 