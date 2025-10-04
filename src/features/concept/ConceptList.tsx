import React from 'react';
import { Brain } from 'lucide-react';
import { VisualizationResult } from '../../types/concept.types';

interface ConceptListProps {
  concepts: VisualizationResult[];
  activeConceptIndex: number;
  onConceptClick: (index: number) => void;
  className?: string;
}

const ConceptList: React.FC<ConceptListProps> = ({
  concepts,
  activeConceptIndex,
  onConceptClick,
  className = '',
}) => {
  if (concepts.length === 0) {
    return null;
  }
  
  return (
    <div className={`${className}`}>
      <div className="mb-3">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Brain size={20} className="mr-2 text-blue-600" />
          Extracted Concepts
        </h3>
        <p className="text-sm text-gray-500">
          Click on a concept to highlight it in the text
        </p>
      </div>
      
      <div className="space-y-2">
        {concepts.map((concept, index) => (
          <button
            key={index}
            onClick={() => onConceptClick(index)}
            className={`w-full text-left p-3 rounded-md transition-colors ${
              index === activeConceptIndex
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <h4 className={`font-medium ${
              index === activeConceptIndex ? 'text-blue-700' : 'text-gray-900'
            }`}>
              {concept.conceptTitle}
            </h4>
            <p className={`text-sm mt-1 line-clamp-2 ${
              index === activeConceptIndex ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {concept.conceptDescription}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConceptList; 