import { useEffect, RefObject } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useConceptContext } from '../contexts/ConceptContext';

export function useScrollTracking(
  textContainerRef: RefObject<HTMLDivElement>,
  textRef: RefObject<HTMLParagraphElement>
) {
  const { activeTab, formattedText } = useAppContext();
  const { 
    results, 
    activeConceptIndex, 
    setActiveConceptIndex, 
    isManualNavigation 
  } = useConceptContext();

  // Scroll tracking to update active concept on scroll
  useEffect(() => {
    if (activeTab !== 'visualization' || results.length === 0 || !textRef.current) return;

    // Skip scroll tracking immediately after manual navigation
    if (isManualNavigation) {
      // Reset flag after a delay to allow normal tracking again
      const timeout = setTimeout(() => {
        // Flag will be reset in the other useEffect after scrolling completes
      }, 800); // Increased timeout for better user experience
      return () => clearTimeout(timeout);
    }

    const handleScroll = () => {
      if (!textContainerRef.current || !textRef.current) return;
      
      // Get container dimensions
      const containerRect = textContainerRef.current.getBoundingClientRect();
      const containerMiddle = containerRect.height / 2;
      
      // Find which concept elements are currently visible in the viewport
      let visibleConcepts = [];
      
      if (formattedText) {
        // When using formatted text, find .temp-highlight elements
        const highlightElements = textRef.current.querySelectorAll('.temp-highlight');
        highlightElements.forEach(element => {
          const elementRect = element.getBoundingClientRect();
          // Calculate element position relative to container
          const relativeTop = elementRect.top - containerRect.top;
          const relativeBottom = elementRect.bottom - containerRect.top;
          
          // Element is visible if it's in the container's viewport
          if (relativeTop < containerRect.height && relativeBottom > 0) {
            visibleConcepts.push({
              element,
              distance: Math.abs(relativeTop + (elementRect.height / 2) - containerMiddle)
            });
          }
        });
      } else {
        // When using original text with highlights, find .concept-highlight elements
        const highlightElements = textRef.current.querySelectorAll('.concept-highlight');
        highlightElements.forEach(element => {
          const conceptIndex = Number(element.getAttribute('data-concept-index'));
          if (conceptIndex >= 0) {
            const elementRect = element.getBoundingClientRect();
            // Calculate element position relative to container
            const relativeTop = elementRect.top - containerRect.top;
            const relativeBottom = elementRect.bottom - containerRect.top;
            
            // Element is visible if it's in the container's viewport
            if (relativeTop < containerRect.height && relativeBottom > 0) {
              visibleConcepts.push({
                element,
                conceptIndex,
                distance: Math.abs(relativeTop + (elementRect.height / 2) - containerMiddle)
              });
            }
          }
        });
      }
      
      // If no concepts are visible, don't change the active concept
      if (visibleConcepts.length === 0) return;
      
      // Sort visible concepts by distance from the middle of the viewport
      visibleConcepts.sort((a, b) => a.distance - b.distance);
      
      // Get the closest concept
      const closestConcept = visibleConcepts[0];
      
      if (formattedText) {
        // For formatted text, we need to find which concept matches this highlight
        const highlightText = closestConcept.element.textContent || '';
        
        // Find the concept that best matches this text
        let bestMatchIndex = activeConceptIndex; // default to current
        let bestMatchScore = 0;
        
        results.forEach((result, index) => {
          // Simple text matching score based on content overlap
          const conceptText = result.conceptTitle.toLowerCase();
          if (highlightText.toLowerCase().includes(conceptText)) {
            const matchScore = conceptText.length / highlightText.length;
            if (matchScore > bestMatchScore) {
              bestMatchScore = matchScore;
              bestMatchIndex = index;
            }
          }
        });
        
        // Only update if we found a better match and it's different from current
        if (bestMatchScore > 0 && bestMatchIndex !== activeConceptIndex) {
          setActiveConceptIndex(bestMatchIndex);
        }
      } else {
        // For original text, we already have the concept index
        const newConceptIndex = closestConcept.conceptIndex;
        
        // Only update if the active concept has changed
        if (activeConceptIndex !== newConceptIndex) {
          setActiveConceptIndex(newConceptIndex);
        }
      }
    };

    const textContainer = textContainerRef.current;
    if (textContainer) {
      // Use throttled event listener to improve performance
      let scrollTimeout: ReturnType<typeof setTimeout>;
      const throttledScrollHandler = () => {
        if (!scrollTimeout) {
          scrollTimeout = setTimeout(() => {
            handleScroll();
            scrollTimeout = null;
          }, 150); // Throttle to every 150ms for better performance
        }
      };
      
      textContainer.addEventListener('scroll', throttledScrollHandler);
      // Initial check
      handleScroll();
      
      return () => {
        if (textContainer) {
          textContainer.removeEventListener('scroll', throttledScrollHandler);
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
        }
      };
    }
  }, [activeTab, results, activeConceptIndex, isManualNavigation, formattedText, textContainerRef, textRef, setActiveConceptIndex]);

  return null;
} 