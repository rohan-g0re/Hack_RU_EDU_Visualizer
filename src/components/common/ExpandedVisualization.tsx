import React, { useEffect } from 'react';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useConceptContext } from '../../contexts/ConceptContext';
import ConceptVisualizer from '../../features/concept/ConceptVisualizer';

interface ExpandedVisualizationProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExpandedVisualization: React.FC<ExpandedVisualizationProps> = ({
  isOpen,
  onClose
}) => {
  const { results, activeConceptIndex, handlePreviousConcept, handleNextConcept } = useConceptContext();
  
  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Add navigation with arrow keys
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeConceptIndex > 0) {
          handlePreviousConcept();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeConceptIndex < results.length - 1) {
          handleNextConcept();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scrolling when expanded view is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, activeConceptIndex, results.length, handlePreviousConcept, handleNextConcept]);
  
  if (!isOpen) return null;
  
  const hasConcepts = results.length > 0 && activeConceptIndex >= 0 && activeConceptIndex < results.length;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A192F]/95 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#112240]/90 border-b border-blue-800/30">
        <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] to-[#8DEBFF]">
          Expanded Visualization
        </h2>
        
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-blue-900/30 transition-colors"
          aria-label="Close expanded view"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 relative p-8">
        {hasConcepts ? (
          <div className="w-full h-full flex items-center justify-center">
            <ConceptVisualizer 
              concept={results[activeConceptIndex]} 
              className="w-full h-full max-w-6xl mx-auto"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
            <p className="mt-6 text-xl">No visualization selected</p>
          </div>
        )}
      </div>
      
      {/* Navigation footer */}
      {results.length > 1 && (
        <div className="flex justify-between items-center px-6 py-4 bg-[#112240]/90 border-t border-blue-800/30">
          <button
            onClick={handlePreviousConcept}
            disabled={activeConceptIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] hover:bg-[#264B77] rounded-lg disabled:bg-[#1E3A5F]/50 disabled:opacity-50 transition-colors"
            aria-label="Previous concept"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="flex items-center justify-center px-4 py-2 bg-[#0A192F]/60 rounded-lg shadow-inner border border-blue-800/20">
            <span className="text-[#38BDF8] font-medium text-lg">{activeConceptIndex + 1}</span>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-300 text-lg">{results.length}</span>
          </div>
          
          <button
            onClick={handleNextConcept}
            disabled={activeConceptIndex === results.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] hover:bg-[#264B77] rounded-lg disabled:bg-[#1E3A5F]/50 disabled:opacity-50 transition-colors"
            aria-label="Next concept"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpandedVisualization; 