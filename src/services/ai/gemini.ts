import { VisualizationPrompt } from '../../types/concept.types';
import { arrayBufferToBase64 } from '../../utils/fileHandling';
import { apiClient } from '../api/apiClient';

/**
 * Generate SVG for a single concept using Gemini via backend API
 * @param concept - The concept to visualize with title and description
 * @param type - The type of visualization to generate
 * @returns Promise with the SVG string
 */
export async function generateSingleConceptSvgWithGemini(
  concept: { title: string; description: string },
  type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap' = 'concept'
): Promise<string> {
  try {
    const response = await apiClient.generateSVG(concept, type, 'gemini');
    return response.svg;
  } catch (error) {
    console.error('Error generating SVG with Gemini:', error);
    throw new Error('Failed to generate SVG visualization with Gemini');
  }
}

/**
 * Convert text to a visual representation using Gemini via backend API
 * @param params - The visualization parameters
 * @returns Promise with the SVG string
 */
export async function generateSvgVisualizationWithGemini({ text, type }: VisualizationPrompt): Promise<string> {
  try {
    // Create a temporary concept from the text
    const concept = {
      title: 'Visualization',
      description: text,
    };
    
    const response = await apiClient.generateSVG(concept, type, 'gemini');
    return response.svg;
  } catch (error) {
    console.error('Error generating SVG visualization with Gemini:', error);
    throw new Error('Failed to generate SVG visualization with Gemini');
  }
}

/**
 * Answer a question about the provided text context using Gemini via backend API
 * @param question - The user's question 
 * @param context - The text context to reference
 * @param conversationHistory - Optional array of previous questions and answers
 * @returns Promise with the answer string
 */
export async function answerQuestionWithContext(
  question: string, 
  context: string, 
  conversationHistory: { type: 'question' | 'answer'; text: string }[] = []
): Promise<string> {
  try {
    const response = await apiClient.answerQuestion(question, context, conversationHistory);
    return response.answer;
  } catch (error) {
    console.error('Error answering question:', error);
    throw new Error('Failed to answer question');
  }
}

/**
 * Extract text from a PDF file using Gemini via backend API
 * @param pdfFile - The PDF file to extract text from
 * @returns Promise with the extracted text
 */
export async function extractTextFromPdfDirectly(pdfFile: File): Promise<string> {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    
    // Convert ArrayBuffer to Base64
    const base64Data = arrayBufferToBase64(arrayBuffer);
    
    // Send to backend API
    const response = await apiClient.extractPDFText(base64Data);
    return response.text;
  } catch (error: unknown) {
    console.error('Error extracting text directly from PDF with Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
  }
}

/**
 * Format text for better readability using HTML structure via backend API
 * @param text - The text to format
 * @param concepts - Optional array of concepts with their text positions to highlight
 * @returns Promise with the formatted HTML text
 */
export async function formatTextForReadability(
  text: string, 
  concepts: { title: string; description: string; startOffset: number; endOffset: number }[] = []
): Promise<string> {
  try {
    const response = await apiClient.formatText(text, concepts);
    return response.formattedHtml;
  } catch (error) {
    console.error('Error formatting text:', error);
    throw new Error('Failed to format text');
  }
}

// Note: Complex text formatting helper functions have been moved to the backend
// All text formatting is now handled securely via the backend API