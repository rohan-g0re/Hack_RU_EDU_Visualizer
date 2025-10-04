import { useState } from 'react';
import { ConceptWithRange } from '../contexts/ConceptContext';

export function useConceptExtraction() {
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  /**
   * Validates and adjusts concept ranges to ensure they capture complete words
   * @param text The original text
   * @param concept The concept with potential inaccurate boundaries
   * @returns Adjusted concept with proper word boundaries
   */
  const validateConceptRange = (
    text: string, 
    concept: ConceptWithRange
  ): ConceptWithRange => {
    // Make a copy to avoid mutating the original
    const adjustedConcept = { ...concept };
    
    // Helper function to check if a character is part of a word
    const isWordChar = (char: string) => /[a-zA-Z0-9]/.test(char);
    
    // Check and adjust starting position - move backward until we find a word boundary
    let start = adjustedConcept.startOffset;
    while (start > 0 && isWordChar(text[start - 1])) {
      start--;
    }
    
    // Check and adjust ending position - move forward until we find a word boundary
    let end = adjustedConcept.endOffset;
    while (end < text.length && isWordChar(text[end])) {
      end++;
    }
    
    // Update the offsets
    adjustedConcept.startOffset = start;
    adjustedConcept.endOffset = end;
    
    return adjustedConcept;
  };
  
  /**
   * Resolves overlapping concepts by either merging them or selecting the one with higher priority
   * @param concepts List of concepts that might overlap
   * @param text Original text for context
   * @returns List of concepts with overlaps resolved
   */
  const resolveOverlappingConcepts = (
    concepts: ConceptWithRange[],
    text: string
  ): ConceptWithRange[] => {
    if (concepts.length <= 1) return concepts;
    
    // Sort concepts by position in the text
    const sortedConcepts = [...concepts].sort((a, b) => a.startOffset - b.startOffset);
    const resolvedConcepts: ConceptWithRange[] = [];
    
    // Check each concept against the next ones for overlaps
    for (let i = 0; i < sortedConcepts.length; i++) {
      const current = sortedConcepts[i];
      let overlapsWithNext = false;
      
      // Skip if this concept has already been merged
      if (current.startOffset === -1) continue;
      
      // Check for overlaps with subsequent concepts
      for (let j = i + 1; j < sortedConcepts.length; j++) {
        const next = sortedConcepts[j];
        
        // Skip if this concept has already been merged
        if (next.startOffset === -1) continue;
        
        // Check for overlap
        if (current.endOffset > next.startOffset) {
          overlapsWithNext = true;
          
          // Get the concept text for comparison
          const currentText = text.substring(current.startOffset, current.endOffset);
          const nextText = text.substring(next.startOffset, next.endOffset);
          
          // If one contains the other, keep the larger one
          if (currentText.includes(nextText)) {
            // Current concept fully contains next one, so mark next to be skipped
            sortedConcepts[j].startOffset = -1;
          } else if (nextText.includes(currentText)) {
            // Next concept fully contains current one, so mark current to be skipped
            sortedConcepts[i].startOffset = -1;
            break; // Skip current concept entirely
          } else {
            // Partial overlap - keep both but adjust boundaries to avoid overlap
            // Choose a sensible breaking point (like a space) between the two concepts
            let breakPoint = next.startOffset;
            
            // Look for a space or punctuation before the overlap
            for (let k = next.startOffset - 1; k > current.startOffset; k--) {
              if (/[\s.,;!?]/.test(text[k])) {
                breakPoint = k + 1; // After the space/punctuation
                break;
              }
            }
            
            // Adjust current to end at the break point
            sortedConcepts[i].endOffset = breakPoint;
          }
        }
      }
      
      // Add the current concept to the resolved list if it wasn't completely merged
      if (sortedConcepts[i].startOffset !== -1) {
        resolvedConcepts.push(sortedConcepts[i]);
      }
    }
    
    return resolvedConcepts;
  };

  /**
   * Removes duplicate concepts (same text appearing multiple times)
   * @param concepts List of concepts that might have duplicates
   * @param text Original text for context
   * @returns Deduplicated list of concepts
   */
  const removeDuplicateConcepts = (
    concepts: ConceptWithRange[],
    text: string
  ): ConceptWithRange[] => {
    // Track concepts by their text content
    const conceptsByText: Record<string, ConceptWithRange> = {};
    
    concepts.forEach(concept => {
      const conceptText = text.substring(concept.startOffset, concept.endOffset);
      
      // If we've already seen this concept text, keep the one with the better description
      if (conceptsByText[conceptText]) {
        // Choose the concept with the longer description as it's likely more informative
        if (concept.description.length > conceptsByText[conceptText].description.length) {
          conceptsByText[conceptText] = concept;
        }
      } else {
        conceptsByText[conceptText] = concept;
      }
    });
    
    return Object.values(conceptsByText);
  };

  // Helper function to extract concepts with text ranges via backend API
  const extractConceptsWithRanges = async (text: string): Promise<ConceptWithRange[]> => {
    try {
      setIsExtracting(true);
      
      // Use backend API to extract concepts with positions
      const { apiClient } = await import('../services/api/apiClient');
      const response = await apiClient.extractConceptsWithRanges(text);
      
      let validConcepts = response.concepts;
      
      // Validate the response
      if (!Array.isArray(validConcepts) || validConcepts.length === 0) {
        throw new Error('Invalid concept extraction response');
      }
      
      // Ensure all concepts have the required fields and adjust text boundaries
      validConcepts = validConcepts.map(concept => validateConceptRange(text, concept));
      
      // Process the concepts further to eliminate duplicates and overlaps
      validConcepts = resolveOverlappingConcepts(validConcepts, text);
      validConcepts = removeDuplicateConcepts(validConcepts, text);
      
      return validConcepts;
    } catch (error: unknown) {
      console.error('Error extracting concepts with positions:', error);
      throw new Error('Failed to extract concepts with position information');
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    isExtracting,
    extractConceptsWithRanges
  };
} 