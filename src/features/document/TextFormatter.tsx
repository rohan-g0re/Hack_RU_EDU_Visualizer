import React, { useState } from 'react';
import { RefreshCw, Loader } from 'lucide-react';
import { formatTextForReadability } from '../../services/ai/gemini';
import Button from '../../components/common/Button';

interface TextFormatterProps {
  text: string;
  formattedText: string;
  onFormattedTextChange: (text: string) => void;
  onError: (error: string) => void;
  className?: string;
}

const TextFormatter: React.FC<TextFormatterProps> = ({
  text,
  formattedText,
  onFormattedTextChange,
  onError,
  className = '',
}) => {
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  
  // Format text using Gemini
  const formatText = async () => {
    if (!text || isFormatting) return;
    
    setIsFormatting(true);
    
    try {
      const result = await formatTextForReadability(text);
      onFormattedTextChange(result);
    } catch (error) {
      console.error('Error formatting text:', error);
      onError(`Failed to format text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsFormatting(false);
    }
  };
  
  const renderText = () => {
    if (!text) {
      return (
        <div className="text-center py-10 text-gray-500">
          No text to display. Please upload a document or enter a URL.
        </div>
      );
    }
    
    // Display formatted text if available, otherwise display original text
    const displayText = formattedText || text;
    
    // Simple processing to add line breaks and maintain whitespace
    return (
      <div className="whitespace-pre-wrap break-words">
        {displayText}
      </div>
    );
  };
  
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-900">Text Content</h3>
        
        {text && (
          <Button
            onClick={formatText}
            disabled={isFormatting || !text}
            isLoading={isFormatting}
            icon={isFormatting ? undefined : <RefreshCw size={16} />}
            variant="secondary"
            size="sm"
          >
            {isFormatting ? 'Formatting...' : 'Format Text'}
          </Button>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-white overflow-auto max-h-[500px]">
        {isFormatting ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <p className="text-gray-600">Formatting text for better readability...</p>
            </div>
          </div>
        ) : (
          renderText()
        )}
      </div>
    </div>
  );
};

export default TextFormatter; 