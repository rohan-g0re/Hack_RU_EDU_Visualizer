import React, { useState } from 'react';
import { Brain, Loader, Zap } from 'lucide-react';
import Button from '../../components/common/Button';
import { ConceptWithRange } from '../../types/concept.types';

interface ConceptExtractorProps {
  text: string;
  onConceptsExtracted: (concepts: ConceptWithRange[]) => void;
  onError: (error: string) => void;
  onStatusChange: (message: string) => void;
  className?: string;
  extractConceptsWithRanges: (text: string) => Promise<ConceptWithRange[]>;
}

const ConceptExtractor: React.FC<ConceptExtractorProps> = ({
  text,
  onConceptsExtracted,
  onError,
  onStatusChange,
  className = '',
  extractConceptsWithRanges,
}) => {
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  
  const handleExtractConcepts = async () => {
    if (!text || isExtracting) return;
    
    setIsExtracting(true);
    onStatusChange('Extracting concepts from text...');
    
    try {
      const concepts = await extractConceptsWithRanges(text);
      
      if (concepts.length === 0) {
        onError('No concepts were found in the text. Please try with different content.');
      } else {
        onConceptsExtracted(concepts);
        onStatusChange(`Successfully extracted ${concepts.length} concepts`);
      }
    } catch (error) {
      console.error('Error extracting concepts:', error);
      onError(`Failed to extract concepts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExtracting(false);
    }
  };
  
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Brain size={20} className="mr-2 text-blue-600" />
          Concept Extraction
        </h3>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        {isExtracting ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader className="h-8 w-8 text-blue-500 animate-spin mb-3" />
            <p className="text-gray-600">Extracting key concepts from your text...</p>
            <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Extract the key concepts from your text to visualize them.
            </p>
            <Button
              onClick={handleExtractConcepts}
              disabled={!text || isExtracting}
              variant="primary"
              icon={<Zap size={16} />}
            >
              Extract Concepts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptExtractor; 