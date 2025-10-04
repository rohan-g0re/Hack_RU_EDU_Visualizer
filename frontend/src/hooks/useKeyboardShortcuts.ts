import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useConceptContext } from '../contexts/ConceptContext';
import { NAVIGATION_SHORTCUTS } from '../constants/keyboardShortcuts';

export function useKeyboardShortcuts() {
  const { activeTab, isExpandedView, setIsExpandedView } = useAppContext();
  const {
    activeConceptIndex,
    results,
    handlePreviousConcept,
    handleNextConcept
  } = useConceptContext();

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if focus is in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Only handle shortcuts in visualization mode
      if (activeTab === 'visualization' && results.length > 0) {
        // Left arrow key for previous concept
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (activeConceptIndex > 0) {
            handlePreviousConcept();
          }
        }
        
        // Right arrow key for next concept
        else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          if (activeConceptIndex < results.length - 1) {
            handleNextConcept();
          }
        }
        
        // 'e' key to expand visualization
        else if (e.key === NAVIGATION_SHORTCUTS.EXPAND_VISUALIZATION.key) {
          e.preventDefault();
          setIsExpandedView(!isExpandedView);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, activeConceptIndex, results.length, handlePreviousConcept, handleNextConcept, isExpandedView, setIsExpandedView]);

  return null;
} 