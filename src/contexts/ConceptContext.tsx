import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { generateSingleConceptSvg } from '../services/ai/claude';
import { generateSingleConceptSvgWithGemini, formatTextForReadability } from '../services/ai/gemini';
import { useAppContext } from './AppContext';
import { useConceptExtraction } from '../hooks/useConceptExtraction';

// Extend the Concept interface to include the relevant text portion
export interface ConceptWithRange {
  title: string;
  description: string;
  startOffset: number;  // Character position where concept starts in original text
  endOffset: number;    // Character position where concept ends in original text
}

// Export types for use in other components
export interface VisualizationResult {
  conceptTitle: string;
  conceptDescription: string;
  startOffset: number;
  endOffset: number;
  svg: string;
}

// Define available models for visualization
export type VisualizationModel = 'gemini' | 'claude';

interface ConceptContextType {
  // Concept state
  results: VisualizationResult[];
  setResults: (results: VisualizationResult[]) => void;
  
  // Concept navigation
  activeConceptIndex: number;
  setActiveConceptIndex: (index: number) => void;
  handlePreviousConcept: () => void;
  handleNextConcept: () => void;
  jumpToConcept: (index: number) => void;
  
  // Concept extraction
  pendingConcepts: ConceptWithRange[];
  setPendingConcepts: (concepts: ConceptWithRange[]) => void;
  currentlyProcessingIndex: number;
  setCurrentlyProcessingIndex: (index: number) => void;
  processingIndices: Set<number>;
  completedIndices: Set<number>;
  
  // Scroll tracking
  isManualNavigation: boolean;
  setIsManualNavigation: (isManual: boolean) => void;
  
  // Visualization handlers
  handleVisualize: () => Promise<void>;
  handleNewVisualization: () => void;
  regenerateConcept: (index: number) => Promise<void>;
  regenerateConceptWithClaude: (index: number) => Promise<void>;
  
  // Model selection
  visualizationModel: VisualizationModel;
  setVisualizationModel: (model: VisualizationModel) => void;
}

// Create the context with default values
const ConceptContext = createContext<ConceptContextType | undefined>(undefined);

// Hook for using the context
export const useConceptContext = () => {
  const context = useContext(ConceptContext);
  if (!context) {
    throw new Error('useConceptContext must be used within a ConceptProvider');
  }
  return context;
};

// Provider component
export function ConceptProvider({ children }: { children: ReactNode }) {
  const {
    inputText, 
    setInputText,
    formattedText,
    setFormattedText,
    isLoading, 
    setIsLoading,
    error,
    setError,
    statusMessage,
    setStatusMessage,
    activeTab,
    setActiveTab,
    showConfirmModal,
    setShowConfirmModal,
    setConfirmCallback
  } = useAppContext();
  
  // Concept extraction hook
  const { extractConceptsWithRanges } = useConceptExtraction();
  
  // State for concepts and visualizations
  const [results, setResults] = useState<VisualizationResult[]>([]);
  const [pendingConcepts, setPendingConcepts] = useState<ConceptWithRange[]>([]);
  const [currentlyProcessingIndex, setCurrentlyProcessingIndex] = useState<number>(-1);
  const [processingIndices, setProcessingIndices] = useState<Set<number>>(new Set());
  const [completedIndices, setCompletedIndices] = useState<Set<number>>(new Set());
  
  // State for keeping track of the concept being viewed
  const [activeConceptIndex, setActiveConceptIndex] = useState<number>(0);
  const [isManualNavigation, setIsManualNavigation] = useState<boolean>(false);
  
  // State for model selection
  const [visualizationModel, setVisualizationModel] = useState<VisualizationModel>('gemini');
  
  // Navigation helpers
  const handlePreviousConcept = () => {
    if (activeConceptIndex > 0) {
      setActiveConceptIndex(prev => prev - 1);
      // Don't set isManualNavigation to true for navigation buttons
      // This prevents auto-scrolling in the text section when switching visualizations
    }
  };
  
  const handleNextConcept = () => {
    if (activeConceptIndex < results.length - 1) {
      setActiveConceptIndex(prev => prev + 1);
      // Don't set isManualNavigation to true for navigation buttons
      // This prevents auto-scrolling in the text section when switching visualizations
    }
  };
  
  // New method for explicit manual navigation with scrolling
  const jumpToConcept = (index: number) => {
    if (index >= 0 && index < results.length) {
      setActiveConceptIndex(index);
      // Set manual navigation flag to trigger scrolling
      setIsManualNavigation(true);
    }
  };
  
  // Handle visualization generation
  const handleVisualize = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError('');
    setResults([]);
    setPendingConcepts([]);
    setProcessingIndices(new Set());
    setCompletedIndices(new Set());
    setStatusMessage("Extracting concepts from text...");
    setFormattedText(''); // Reset formatted text when starting a new visualization
    setActiveConceptIndex(0); // Reset to the first concept
    
    try {
      // Step 1: Extract concepts with text ranges using the chunking approach
      setStatusMessage("Analyzing text and extracting concepts from chunks...");
      const conceptsWithRanges = await extractConceptsWithRanges(inputText);
      
      // The concepts are already sorted by their position in the text (from start to end)
      
      // Set the pending concepts to show in the UI
      setPendingConcepts(conceptsWithRanges);
      
      // Step 2: Format the text for better readability with highlighted concepts
      setStatusMessage("Formatting text and highlighting concepts...");
      try {
        // Pass the concepts to the formatting function to highlight them
        const formattedTextContent = await formatTextForReadability(inputText, conceptsWithRanges);
        setFormattedText(formattedTextContent);
      } catch (err) {
        console.error("Error formatting text:", err);
        // If formatting fails, we'll use the original text
      }
      
      // Step 3: Generate visualizations one by one (chunking + chaining approach)
      setStatusMessage("Generating visualizations concurrently...");
      const newResults: VisualizationResult[] = [];
      
      // Create a placeholder array for the results to maintain the order
      const resultPlaceholders = conceptsWithRanges.map(concept => ({
        conceptTitle: concept.title,
        conceptDescription: concept.description,
        startOffset: concept.startOffset,
        endOffset: concept.endOffset,
        svg: '' // Will be filled in when the SVG is generated
      }));
      
      // Create an array to track which concepts have completed
      const completedIndexes = new Set<number>();
      
      // Set all concepts as processing initially
      const allIndices = new Set(conceptsWithRanges.map((_, idx) => idx));
      setProcessingIndices(allIndices);
      
      // Process all concepts concurrently using Promise.all
      try {
        // Create an array of promises for each concept's SVG generation
        const svgPromises = conceptsWithRanges.map((concept, index) => {
          // Return a promise that resolves with the index and the SVG
          return new Promise<{index: number, svg: string}>(async (resolve) => {
            try {
              setStatusMessage(`Started generating visualization for: "${concept.title}" (${index+1} of ${conceptsWithRanges.length})`);
              
              // Generate SVG based on selected model
              let svg: string;
              
              if (visualizationModel === 'claude') {
                svg = await generateSingleConceptSvg({
                  title: concept.title,
                  description: concept.description
                }, 'concept');
              } else {
                // Default to Gemini
                svg = await generateSingleConceptSvgWithGemini({
                  title: concept.title,
                  description: concept.description
                }, 'concept');
              }
              
              // Mark this index as completed
              completedIndexes.add(index);
              
              // Update processing indices - remove this index from processing set
              setProcessingIndices(prev => {
                const updated = new Set(prev);
                updated.delete(index);
                return updated;
              });
              
              // Add to completed indices
              setCompletedIndices(prev => {
                const updated = new Set(prev);
                updated.add(index);
                return updated;
              });
              
              setCurrentlyProcessingIndex(index);
              
              // Update the status message to show progress
              setStatusMessage(`Completed ${completedIndexes.size} of ${conceptsWithRanges.length} visualizations`);
              
              // Resolve with the index and SVG
              resolve({ index, svg });
            } catch (error) {
              console.error(`Error generating SVG for concept "${concept.title}":`, error);
              
              // Update processing indices - remove this index from processing set
              setProcessingIndices(prev => {
                const updated = new Set(prev);
                updated.delete(index);
                return updated;
              });
              
              // Resolve with empty SVG to continue with the other concepts
              resolve({ index, svg: '' });
            }
          });
        });
        
        // Wait for all SVG generation promises to complete, in any order
        const results = await Promise.all(svgPromises);
        
        // Process the results in the order they were received
        for (const { index, svg } of results) {
          if (svg) {
            // Update the placeholder with the generated SVG
            resultPlaceholders[index].svg = svg;
          }
        }
        
        // Filter out any results that don't have an SVG
        const validResults = resultPlaceholders.filter(result => result.svg);
        
        // Update the final results
        setResults(validResults);
        newResults.push(...validResults);
      } catch (error) {
        console.error('Error processing SVG generation results:', error);
      }
      
      setCurrentlyProcessingIndex(-1);
      setStatusMessage('');
      
      // Only change to visualization tab if we have results
      if (newResults.length > 0) {
        setActiveTab('visualization');
        // Ensure we're starting at the first concept
        setActiveConceptIndex(0);
      } else {
        throw new Error('No concepts could be visualized successfully');
      }
    } catch (error: any) {
      console.error('Error generating visualizations:', error);
      setError(`Failed to generate visualizations: ${error.message || 'Unknown error'}`);
      setStatusMessage('');
    }
    setIsLoading(false);
  };
  
  // Handle new visualization with confirmation
  const handleNewVisualization = () => {
    // Show confirmation dialog if there are results
    if (results.length > 0) {
      const handleConfirm = () => {
        // Reset the state to default
        setInputText('');
        setResults([]);
        setPendingConcepts([]);
        setProcessingIndices(new Set());
        setCompletedIndices(new Set());
        setFormattedText('');
        setError('');
        setStatusMessage('');
        setActiveConceptIndex(0);
        setActiveTab('input');
        setShowConfirmModal(false);
      };
      
      setConfirmCallback(() => handleConfirm);
      setShowConfirmModal(true);
    } else {
      // No results, just reset
      setInputText('');
      setActiveTab('input');
    }
  };
  
  // Handle regenerating a specific concept's visualization
  const regenerateConcept = async (index: number) => {
    if (index < 0 || index >= results.length) return;
    
    setIsLoading(true);
    setError('');
    setStatusMessage(`Regenerating visualization for "${results[index].conceptTitle}"...`);
    
    // Set this index as processing and remove from completed
    setProcessingIndices(new Set([index]));
    setCompletedIndices(prev => {
      const updated = new Set(prev);
      updated.delete(index);
      return updated;
    });
    
    try {
      // Get the concept to regenerate
      const concept = results[index];
      
      // Generate new SVG for this concept
      const newSvg = await generateSingleConceptSvgWithGemini({
        title: concept.conceptTitle,
        description: concept.conceptDescription
      }, 'concept');
      
      // Update the results array with the new SVG
      const updatedResults = [...results];
      updatedResults[index] = {
        ...concept,
        svg: newSvg
      };
      
      // Update state with the new results
      setResults(updatedResults);
      setStatusMessage('');
      
      // Mark as completed
      setCompletedIndices(prev => {
        const updated = new Set(prev);
        updated.add(index);
        return updated;
      });
    } catch (error: any) {
      console.error('Error regenerating visualization:', error);
      setError(`Failed to regenerate visualization: ${error.message || 'Unknown error'}`);
      setStatusMessage('');
    }
    
    // Clear processing indices
    setProcessingIndices(new Set());
    setIsLoading(false);
  };
  
  // Handle regenerating a specific concept's visualization with Claude
  const regenerateConceptWithClaude = async (index: number) => {
    if (index < 0 || index >= results.length) return;
    
    setIsLoading(true);
    setError('');
    setStatusMessage(`Regenerating visualization for "${results[index].conceptTitle}"...`);
    
    // Set this index as processing and remove from completed
    setProcessingIndices(new Set([index]));
    setCompletedIndices(prev => {
      const updated = new Set(prev);
      updated.delete(index);
      return updated;
    });
    
    try {
      // Get the concept to regenerate
      const concept = results[index];
      
      // Generate new SVG for this concept using Claude
      const newSvg = await generateSingleConceptSvg({
        title: concept.conceptTitle,
        description: concept.conceptDescription
      }, 'concept');
      
      // Update the results array with the new SVG
      const updatedResults = [...results];
      updatedResults[index] = {
        ...concept,
        svg: newSvg
      };
      
      // Update state with the new results
      setResults(updatedResults);
      setStatusMessage('');
      
      // Mark as completed
      setCompletedIndices(prev => {
        const updated = new Set(prev);
        updated.add(index);
        return updated;
      });
    } catch (error: any) {
      console.error('Error regenerating visualization:', error);
      setError(`Failed to regenerate visualization: ${error.message || 'Unknown error'}`);
      setStatusMessage('');
    }
    
    // Clear processing indices
    setProcessingIndices(new Set());
    setIsLoading(false);
  };
  
  return (
    <ConceptContext.Provider
      value={{
        results,
        setResults,
        activeConceptIndex,
        setActiveConceptIndex,
        handlePreviousConcept,
        handleNextConcept,
        jumpToConcept,
        pendingConcepts,
        setPendingConcepts,
        currentlyProcessingIndex,
        setCurrentlyProcessingIndex,
        processingIndices,
        completedIndices,
        isManualNavigation,
        setIsManualNavigation,
        handleVisualize,
        handleNewVisualization,
        regenerateConcept,
        regenerateConceptWithClaude,
        visualizationModel,
        setVisualizationModel
      }}
    >
      {children}
    </ConceptContext.Provider>
  );
} 