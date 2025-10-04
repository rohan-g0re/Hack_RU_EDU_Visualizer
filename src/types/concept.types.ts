/**
 * Type definitions for concepts
 */

/**
 * Basic concept information
 */
export interface Concept {
  title: string;
  description: string;
}

/**
 * Concept with position information in the text
 */
export interface ConceptWithRange extends Concept {
  startOffset: number;  // Character position where concept starts in original text
  endOffset: number;    // Character position where concept ends in original text
}

/**
 * The result of concept visualization, including SVG representation
 */
export interface VisualizationResult {
  conceptTitle: string;
  conceptDescription: string;
  startOffset: number;
  endOffset: number;
  svg: string;
}

/**
 * Segment of text that may contain highlighted concepts
 */
export interface TextSegment {
  text: string;
  isHighlighted: boolean;
  conceptIndex: number;
}

/**
 * Result from text highlighting process
 */
export interface TextHighlightResult {
  segments: TextSegment[];
  handleConceptClick: (conceptIndex: number) => void;
}

/**
 * Parameters for visualization prompt
 */
export interface VisualizationPrompt {
  text: string;
  type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap';
} 