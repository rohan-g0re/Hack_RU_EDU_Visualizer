import { useState, useEffect, useRef } from 'react';
import { formatTextForReadability } from '../services/ai/gemini';
import { useAppContext } from '../contexts/AppContext';
import { useConceptContext } from '../contexts/ConceptContext';

// Define segment type
export interface TextSegment {
  text: string;
  isHighlighted: boolean;
  conceptIndex: number;
}

// Define the return type of renderTextWithHighlights
export interface TextHighlightResult {
  segments: TextSegment[];
  handleConceptClick: (conceptIndex: number) => void;
}

export function useTextHighlighting() {
  const { 
    inputText, 
    formattedText, 
    setFormattedText, 
    activeTab, 
    setIsFormatting, 
    setStatusMessage 
  } = useAppContext();
  
  const { 
    results, 
    activeConceptIndex, 
    setActiveConceptIndex, 
    isManualNavigation, 
    setIsManualNavigation,
    jumpToConcept
  } = useConceptContext();
  
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  
  // Format the text when switching to visualization view
  useEffect(() => {
    async function formatText() {
      if (activeTab === 'visualization' && inputText && !formattedText) {
        try {
          setIsFormatting(true);
          setStatusMessage("Formatting text for better readability...");
          
          // Use the current results to extract concepts for highlighting
          const conceptsToHighlight = results.map(result => ({
            title: result.conceptTitle,
            description: result.conceptDescription,
            startOffset: result.startOffset,
            endOffset: result.endOffset
          }));
          
          // Pass concepts to the formatting function
          const formatted = await formatTextForReadability(inputText, conceptsToHighlight);
          setFormattedText(formatted);
          setStatusMessage("");
        } catch (err) {
          console.error("Error formatting text:", err);
          // If formatting fails, we'll fall back to the original text
        } finally {
          setIsFormatting(false);
        }
      }
    }
    
    formatText();
  }, [activeTab, inputText, formattedText, results, setIsFormatting, setStatusMessage, setFormattedText]);

  // Update the useEffect that handles tab changes
  useEffect(() => {
    // Reset formatted text when going back to input tab
    if (activeTab === 'input') {
      setFormattedText('');
    }
  }, [activeTab, setFormattedText]);

  // Add a function to refresh formatting
  const refreshFormatting = async () => {
    try {
      setIsFormatting(true);
      setStatusMessage("Refreshing text formatting...");
      setFormattedText(''); // Clear current formatting
      
      // Use the current results to extract concepts for highlighting
      const conceptsToHighlight = results.map(result => ({
        title: result.conceptTitle,
        description: result.conceptDescription,
        startOffset: result.startOffset,
        endOffset: result.endOffset
      }));
      
      // Pass concepts to the formatting function
      const formatted = await formatTextForReadability(inputText, conceptsToHighlight);
      setFormattedText(formatted);
      setStatusMessage("");
    } catch (err) {
      console.error("Error formatting text:", err);
      setStatusMessage("");
    } finally {
      setIsFormatting(false);
    }
  };
  
  // Add useEffect to scroll to active concept when it changes
  useEffect(() => {
    // Only apply when in visualization mode and we have results
    if (activeTab !== 'visualization' || results.length === 0) return;
    
    // Find the highlighted element for the active concept
    const highlightElements = document.querySelectorAll('.concept-highlight');
    const activeElement = Array.from(highlightElements).find(
      element => Number(element.getAttribute('data-concept-index')) === activeConceptIndex
    );
    
    // Only perform highlighting but no scrolling, even if manual navigation is requested
    if (activeElement && textContainerRef.current) {
      // Add a temporary highlight animation without scrolling
      activeElement.classList.add('bg-[#38BDF8]/40', 'transition-colors');
      setTimeout(() => {
        activeElement.classList.remove('bg-[#38BDF8]/40');
      }, 1000);
      
      // Reset the manual navigation flag immediately
      setIsManualNavigation(false);
    }
  }, [activeConceptIndex, activeTab, results.length, isManualNavigation, setIsManualNavigation]);
  
  // Effect to handle synchronization when formatted text is active
  useEffect(() => {
    if (activeTab !== 'visualization' || results.length === 0 || !formattedText) return;

    // Delay slightly to ensure DOM is updated with formatted text
    const timer = setTimeout(() => {
      // For formatted text, we need to add highlights over the existing formatted text
      const textContainer = textRef.current;
      if (!textContainer) return;

      // Remove any previous highlights
      const oldHighlights = textContainer.querySelectorAll('.temp-highlight');
      oldHighlights.forEach(el => el.classList.remove('temp-highlight', 'bg-[#38BDF8]/20', 'border-b-2', 'border-[#38BDF8]'));

      // Find text nodes that match the concept
      if (activeConceptIndex >= 0 && activeConceptIndex < results.length) {
        const activeConcept = results[activeConceptIndex];
        
        // Also add a data attribute to the document to identify the current concept
        textContainer.setAttribute('data-active-concept-index', activeConceptIndex.toString());
        textContainer.setAttribute('data-active-concept-title', activeConcept.conceptTitle);
        
        // Find and highlight the active concept without scrolling
        const highlightedElements = textContainer.querySelectorAll('.highlighted-concept');
        highlightedElements.forEach(el => {
          const conceptIndex = Number(el.getAttribute('data-concept-index'));
          if (conceptIndex === activeConceptIndex) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });
      }
    }, 250); // Slight increase in delay to ensure DOM is fully updated
    
    return () => clearTimeout(timer);
  }, [activeConceptIndex, activeTab, results, formattedText, inputText]);
  
  // Add useEffect to scroll into view and highlight active concept when it changes
  // This only runs when we explicitly want to scroll (like clicking the "Jump to concept" button)
  useEffect(() => {
    if (activeTab !== 'visualization' || !formattedText || !textRef.current) return;
    
    // Only run this if the navigation was manual AND we specifically want to scroll
    if (isManualNavigation) {
      // Find the element for the active concept index
      const highlightedElements = textRef.current.querySelectorAll('.highlighted-concept');
      const activeElement = Array.from(highlightedElements).find(
        element => Number(element.getAttribute('data-concept-index')) === activeConceptIndex
      ) as HTMLElement;
      
      if (activeElement && textContainerRef.current) {
        // Update the visual highlighting immediately
        highlightedElements.forEach(el => el.classList.remove('active'));
        activeElement.classList.add('active');
        
        // Don't perform scrolling - this was causing the auto-scroll issue
        // Reset manual navigation immediately
        setIsManualNavigation(false);
      }
    }
  }, [activeConceptIndex, activeTab, formattedText, isManualNavigation, setIsManualNavigation]);
  
  // Helper function to highlight text nodes
  const highlightTextNodes = (
    textNodes: Node[], 
    matchText: string, 
    containerRef: React.RefObject<HTMLDivElement>
  ) => {
    textNodes.forEach((node, nodeIndex) => {
      const span = document.createElement('span');
      span.className = 'temp-highlight bg-[#38BDF8]/20 border-b-2 border-[#38BDF8]';
      const text = node.textContent || '';
      const matchIndex = text.indexOf(matchText);
      
      if (matchIndex >= 0) {
        const range = document.createRange();
        range.setStart(node, matchIndex);
        range.setEnd(node, matchIndex + matchText.length);
        range.surroundContents(span);
        
        // Scroll to the first highlight
        if (nodeIndex === 0 && containerRef.current) {
          setTimeout(() => {
            span.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
    });
  };
  
  // Function to highlight concepts in the original text
  const renderTextWithHighlights = (): string | TextHighlightResult => {
    if (!inputText || results.length === 0) return inputText;
    
    // Create an array to store all the segments of text
    const segments: TextSegment[] = [];
    let lastIndex = 0;
    
    // Sort results by start position to process them in order
    const sortedResults = [...results].sort((a, b) => a.startOffset - b.startOffset);
    
    // Process each concept
    sortedResults.forEach((result) => {
      // Add the text before this concept
      if (result.startOffset > lastIndex) {
        segments.push({
          text: inputText.substring(lastIndex, result.startOffset),
          isHighlighted: false,
          conceptIndex: -1
        });
      }
      
      // Add the concept text with highlight
      segments.push({
        text: inputText.substring(result.startOffset, result.endOffset),
        isHighlighted: true,
        conceptIndex: results.findIndex(r => 
          r.conceptTitle === result.conceptTitle && 
          r.startOffset === result.startOffset
        )
      });
      
      lastIndex = result.endOffset;
    });
    
    // Add any remaining text after the last concept
    if (lastIndex < inputText.length) {
      segments.push({
        text: inputText.substring(lastIndex),
        isHighlighted: false,
        conceptIndex: -1
      });
    }
    
    // Handle clicks on highlighted concepts - use jumpToConcept to enable scrolling
    const handleConceptClick = (conceptIndex: number) => {
      if (conceptIndex >= 0 && conceptIndex < results.length) {
        // Set the active concept directly without scrolling
        setActiveConceptIndex(conceptIndex);
      }
    };
    
    // Return the segments and handler
    return { segments, handleConceptClick };
  };
  
  // Add useEffect to detect intersection with highlighted concepts
  useEffect(() => {
    if (activeTab !== 'visualization' || !formattedText) return;
    
    // This useEffect adds intersection observer to detect when concepts are in view
    const container = textRef.current;
    if (!container) return;
    
    // Find all highlighted concept spans
    const highlightedElements = container.querySelectorAll('.highlighted-concept');
    if (highlightedElements.length === 0) return;
    
    // Function to handle concept visibility and clicks
    const setupConceptInteractions = () => {
      // Add click handler to all highlighted concepts
      highlightedElements.forEach(element => {
        // Add click event to switch to the concept visualization
        element.addEventListener('click', (e) => {
          // Get the concept index
          const conceptIndex = Number(element.getAttribute('data-concept-index'));
          if (!isNaN(conceptIndex) && conceptIndex >= 0 && conceptIndex < results.length) {
            // Prevent default behavior that might cause scrolling
            e.preventDefault();
            
            // Set the active concept index directly without triggering scroll
            setActiveConceptIndex(conceptIndex);
            
            // Update the visual highlighting
            highlightedElements.forEach(el => el.classList.remove('active'));
            element.classList.add('active');
          }
        });
        
        // Add mouseenter event to highlight the active concept
        element.addEventListener('mouseenter', () => {
          element.classList.add('active');
        });
        
        // Add mouseleave event to remove highlight if it's not the current active concept
        element.addEventListener('mouseleave', () => {
          const conceptIndex = Number(element.getAttribute('data-concept-index'));
          if (conceptIndex !== activeConceptIndex) {
            element.classList.remove('active');
          }
        });
      });
      
      // Highlight the current active concept if it exists
      const activeElement = Array.from(highlightedElements).find(
        element => Number(element.getAttribute('data-concept-index')) === activeConceptIndex
      );
      if (activeElement) {
        highlightedElements.forEach(el => el.classList.remove('active'));
        activeElement.classList.add('active');
      }
    };
    
    // Set up tracking for scroll direction
    let lastScrollTop = textContainerRef.current?.scrollTop || 0;
    let scrollDirection: 'up' | 'down' | null = null;
    let scrollTimer: NodeJS.Timeout | null = null;
    let isScrolling = false;
    
    // Track scroll position and determine direction
    const handleScroll = () => {
      if (!textContainerRef.current) return;
      
      isScrolling = true;
      
      const currentScrollTop = textContainerRef.current.scrollTop;
      if (currentScrollTop > lastScrollTop) {
        scrollDirection = 'down';
      } else if (currentScrollTop < lastScrollTop) {
        scrollDirection = 'up';
      }
      lastScrollTop = currentScrollTop;
      
      // Clear previous timer and set a new one
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 150); // Short delay to detect when scrolling stops
    };
    
    // Add scroll event listener
    if (textContainerRef.current) {
      textContainerRef.current.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Create intersection observer to detect when concepts are in view
    const observerOptions = {
      root: textContainerRef.current,
      rootMargin: '0px',
      threshold: 0.5 // Element is considered visible when 50% is in view
    };
    
    let lastIntersectingIndex = activeConceptIndex;
    let visibleConceptIndices: number[] = [];
    
    // Debounce function to prevent too frequent updates
    let debounceTimer: NodeJS.Timeout | null = null;
    const debounceIntersectionUpdate = (callback: () => void) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(callback, 200); // 200ms debounce
    };
    
    const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
      // Skip processing if manual navigation is active
      if (isManualNavigation) return;
      
      // Update the list of currently visible concepts
      entries.forEach(entry => {
        const element = entry.target as HTMLElement;
        const conceptIndex = Number(element.getAttribute('data-concept-index'));
        
        if (entry.isIntersecting) {
          // Add to visible concepts if not already included
          if (!visibleConceptIndices.includes(conceptIndex)) {
            visibleConceptIndices.push(conceptIndex);
          }
        } else {
          // Remove from visible concepts
          visibleConceptIndices = visibleConceptIndices.filter(idx => idx !== conceptIndex);
        }
      });
      
      // Debounce the update to prevent rapid changes
      debounceIntersectionUpdate(() => {
        // Don't change if we're not scrolling or have no direction
        if (!isScrolling || !scrollDirection) return;
        
        // If current active concept is still visible, prefer to keep it
        if (visibleConceptIndices.includes(activeConceptIndex)) {
          return;
        }
        
        // Only update if we have visible concepts
        if (visibleConceptIndices.length > 0) {
          // Create a sorted array of visible concepts by their position in the document
          const sortedVisibleConcepts = [...visibleConceptIndices].sort((a, b) => {
            return results[a].startOffset - results[b].startOffset;
          });
          
          // Select concept based on scroll direction
          let newActiveIndex: number;
          
          if (scrollDirection === 'down') {
            // When scrolling down, prefer the concept that appears later in the document
            // from visible concepts that are positioned before the current active concept
            const conceptsBefore = sortedVisibleConcepts.filter(idx => 
              results[idx].startOffset <= (
                activeConceptIndex < results.length 
                  ? results[activeConceptIndex].startOffset 
                  : Infinity
              )
            );
            
            if (conceptsBefore.length > 0) {
              // Get the last one (most recent one we scrolled to)
              newActiveIndex = conceptsBefore[conceptsBefore.length - 1];
            } else {
              // If no concepts before, get the first one
              newActiveIndex = sortedVisibleConcepts[0];
            }
          } else {
            // When scrolling up, prefer the concept that appears earlier in the document
            // from visible concepts that are positioned after the current active concept
            const conceptsAfter = sortedVisibleConcepts.filter(idx => 
              results[idx].startOffset >= (
                activeConceptIndex >= 0 
                  ? results[activeConceptIndex].startOffset 
                  : 0
              )
            );
            
            if (conceptsAfter.length > 0) {
              // Get the first one (most recent one we scrolled to)
              newActiveIndex = conceptsAfter[0];
            } else {
              // If no concepts after, get the last one
              newActiveIndex = sortedVisibleConcepts[sortedVisibleConcepts.length - 1];
            }
          }
          
          // Only update if this is a different concept than the current active one
          if (newActiveIndex !== lastIntersectingIndex) {
            // Update active concept without triggering manual navigation
            // This ensures the text won't auto-scroll when we update the active concept based on scrolling
            setActiveConceptIndex(newActiveIndex);
            lastIntersectingIndex = newActiveIndex;
            
            // Update visual highlighting
            highlightedElements.forEach(el => {
              const elIndex = Number(el.getAttribute('data-concept-index'));
              if (elIndex === newActiveIndex) {
                el.classList.add('active');
              } else {
                el.classList.remove('active');
              }
            });
          }
        }
      });
    };
    
    // Create and start the observer
    const observer = new IntersectionObserver(intersectionCallback, observerOptions);
    
    // Add all highlighted elements to the observer
    highlightedElements.forEach(element => {
      observer.observe(element);
    });
    
    // Setup click interactions
    setupConceptInteractions();
    
    return () => {
      // Clean up observer and event listeners
      observer.disconnect();
      
      if (debounceTimer) clearTimeout(debounceTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
      
      if (textContainerRef.current) {
        textContainerRef.current.removeEventListener('scroll', handleScroll);
      }
      
      highlightedElements.forEach(element => {
        element.removeEventListener('click', () => {});
        element.removeEventListener('mouseenter', () => {});
        element.removeEventListener('mouseleave', () => {});
      });
    };
  }, [activeTab, formattedText, results, activeConceptIndex, setActiveConceptIndex, setIsManualNavigation, isManualNavigation]);
  
  return {
    textContainerRef,
    textRef,
    refreshFormatting,
    renderTextWithHighlights
  };
} 