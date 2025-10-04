import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import IconButton from '../../components/common/IconButton';
import { VisualizationResult } from '../../types/concept.types';

interface ConceptNavigatorProps {
  concepts: VisualizationResult[];
  activeConceptIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

const ConceptNavigator: React.FC<ConceptNavigatorProps> = ({
  concepts,
  activeConceptIndex,
  onPrevious,
  onNext,
  className = '',
}) => {
  if (concepts.length <= 1) {
    return null;
  }
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center">
        <span className="text-sm text-gray-500">
          Concept {activeConceptIndex + 1} of {concepts.length}
        </span>
      </div>
      
      <div className="flex space-x-2">
        <IconButton
          icon={<ChevronLeft size={18} />}
          onClick={onPrevious}
          variant="tertiary"
          size="sm"
          aria-label="Previous concept"
          tooltip="Previous concept"
        />
        
        <IconButton
          icon={<ChevronRight size={18} />}
          onClick={onNext}
          variant="tertiary"
          size="sm"
          aria-label="Next concept"
          tooltip="Next concept"
        />
      </div>
    </div>
  );
};

export default ConceptNavigator; 