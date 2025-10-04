import { apiClient } from '../api/apiClient';

export interface VisualizationPrompt {
  text: string;
  type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap';
}

export interface Concept {
  title: string;
  description: string;
}

/**
 * Generate SVG for a single concept using Claude via backend API
 * @param concept - The concept to visualize
 * @param type - The type of visualization
 * @returns Promise with the SVG string
 */
export async function generateSingleConceptSvg(
  concept: { title: string; description: string },
  type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap' = 'concept'
): Promise<string> {
  try {
    const response = await apiClient.generateSVG(concept, type, 'claude');
    return response.svg;
  } catch (error) {
    console.error('Error generating SVG with Claude:', error);
    throw new Error('Failed to generate SVG visualization');
  }
}

/**
 * Convert text to a visual representation using Claude via backend API
 * @param params - The visualization parameters
 * @returns Promise with the SVG string
 */
export async function generateSvgVisualization({ text, type }: VisualizationPrompt): Promise<string> {
  try {
    // Create a temporary concept from the text
    const concept = {
      title: 'Visualization',
      description: text,
    };
    
    const response = await apiClient.generateSVG(concept, type, 'claude');
    return response.svg;
  } catch (error) {
    console.error('Error generating SVG visualization:', error);
    throw new Error('Failed to generate SVG visualization');
  }
}

/**
 * Extract concepts from text using Claude via backend API
 * @param text - The text to extract concepts from
 * @returns Promise with array of concepts
 */
export async function extractConcepts(text: string): Promise<Concept[]> {
  try {
    const response = await apiClient.extractConcepts(text);
    return response.concepts;
  } catch (error) {
    console.error('Error extracting concepts:', error);
    throw new Error('Failed to extract concepts from text');
  }
}