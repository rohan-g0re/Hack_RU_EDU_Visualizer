import { GoogleGenerativeAI } from '@google/generative-ai';
import { VisualizationPrompt } from '../../types/concept.types';
import { arrayBufferToBase64 } from '../../utils/fileHandling';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Generate SVG for a single concept using Gemini 2.0 Flash
 * @param concept - The concept to visualize with title and description
 * @param type - The type of visualization to generate
 * @returns Promise with the SVG string
 */
export async function generateSingleConceptSvgWithGemini(concept: { title: string, description: string }, type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' = 'concept'): Promise<string> {
  const prompt = `${concept.title}: ${concept.description}`;
  return await generateSvgVisualizationWithGemini({ text: prompt, type });
}

/**
 * Convert text to a visual representation using Gemini 2.0 Flash
 * @param params - The visualization parameters
 * @returns Promise with the SVG string
 */
export async function generateSvgVisualizationWithGemini({ text, type }: VisualizationPrompt): Promise<string> {
  try {
    // Use Gemini 2.0 Flash model for SVG generation
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert at creating precise, technical SVG visualizations optimized for digital displays.
    
    requirements:
    1. Fixed dimensions: width="700" height="480" viewBox="0 0 700 480"
    2. Create a good looking and technical SVG such that it will help the user quickly understand the concept in it.
    
    Content to visualize:
    ${text}
    
    Return ONLY the SVG markup with no explanation. The SVG must adhere exactly to the dimensional constraints.`;

    // Generate the SVG using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const svgResponse = response.text();
    
    // Clean and extract just the SVG code
    const svgMatch = svgResponse.match(/<svg[\s\S]*<\/svg>/);
    if (!svgMatch) {
      console.error('No SVG found in response:', svgResponse);
      throw new Error('Failed to generate SVG visualization');
    }

    // Get clean SVG code
    let svgCode = svgMatch[0];
    
    // Force the dimensions to ensure proper display
    svgCode = svgCode.replace(/<svg[^>]*>/, '<svg width="700" height="480" viewBox="0 0 700 480" xmlns="http://www.w3.org/2000/svg">');
    
    return svgCode;
  } catch (error) {
    console.error('Error generating SVG visualization with Gemini:', error);
    throw new Error('Failed to generate SVG visualization with Gemini');
  }
}

/**
 * Answer a question about the provided text context using Gemini AI
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
    // Use Gemini 2.0 Flash model for accurate answers
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Format previous conversation for the prompt
    const previousConversation = conversationHistory.length > 0 
      ? `\nPREVIOUS CONVERSATION:\n${conversationHistory
          .map(item => `${item.type === 'question' ? 'USER' : 'ASSISTANT'}: ${item.text}`)
          .join('\n')}\n`
      : '';

    const prompt = `You are an intelligent assistant that helps users understand text. 
    Explain in a way that is easy to understand.
    Answer the question with best of your knowledge.
    When referring to previous questions or answers, take into account the conversation history.
    ${previousConversation}
    
    CONTEXT:
    ${context}
    
    QUESTION:
    ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the text from raw Markdown syntax before formatting
    let cleanedText = text
      // Convert Markdown bold to HTML strong tags
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Convert Markdown italics to HTML em tags
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Convert Markdown code to HTML code tags
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    // Format the response with proper HTML styling for better readability
    const formattedText = cleanedText
      // Replace bullet points with proper list items
      .replace(/^(\s*)\*\s+(.+)$/gm, '<li>$2</li>')
      // Wrap consecutive list items in a ul
      .replace(/<li>(.+)<\/li>(\s*)<li>/g, '<ul><li>$1</li>$2<li>')
      .replace(/<\/li>(\s*)(?!<li>|<\/ul>)/g, '</li></ul>$1')
      // Convert line breaks to proper HTML paragraphs (but not inside lists)
      .split(/\n{2,}/)
      .map(paragraph => {
        // Skip wrapping in <p> if it's already a list
        if (paragraph.includes('<li>') || paragraph.includes('</li>')) {
          return paragraph;
        }
        return `<p class="mb-3">${paragraph.trim()}</p>`;
      })
      .join('')
      // Replace remaining single line breaks with <br> (but not inside lists)
      .replace(/(?<!<\/li>)\n(?!<li>)/g, '<br>')
      // Format headings if any (e.g., "DistilBERT: A faster BERT model")
      .replace(/<p class="mb-3">([^:]+):([^<]+)<\/p>/g, '<p class="mb-3"><strong>$1:</strong>$2</p>')
      // Clean up any potentially unclosed tags
      .replace(/<ul>(?![\s\S]*<\/ul>)/g, '<ul></ul>')
      .replace(/<li>(?![\s\S]*<\/li>)/g, '<li></li>');
      
    return formattedText;
  } catch (error) {
    console.error('Error answering question:', error);
    throw new Error('Failed to answer question');
  }
}

/**
 * Extract text from a PDF file using Gemini
 * The new implementation uses a more detailed prompt for better text extraction
 * @param pdfFile - The PDF file to extract text from
 * @returns Promise with the extracted text
 */
export async function extractTextFromPdfDirectly(pdfFile: File): Promise<string> {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    
    // Convert ArrayBuffer to Base64
    const base64Data = arrayBufferToBase64(arrayBuffer);
    
    // Use the Gemini 2.0 Flash model for PDF processing
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Create a file part for the model
    const filePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'application/pdf'
      }
    };
    
    // Send the PDF directly to Gemini with instructions
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Extract all text from this PDF document with EXACT format preservation.

IMPORTANT REQUIREMENTS:
1. Preserve ALL heading levels by leaving them exactly as they appear
2. Maintain ALL paragraph breaks with proper spacing
3. Keep ALL bullet points and numbered lists with their exact indentation and symbols
4. Maintain table structures with proper spacing and alignment
5. Keep the document's sections and hierarchical structure intact
6. Ensure that titles are separated from body text properly
7. Preserve any footnotes or citations with their exact formatting
8. Maintain the layout of any specialized formatting (code blocks, quotes, etc.)

Your output should look EXACTLY like the PDF but in plain text format.
Do NOT add any additional explanations, commentary, or notes.
Just extract the text with its original formatting preserved.`
            },
            filePart
          ]
        }
      ]
    });
    
    const response = await result.response;
    return response.text();
  } catch (error: unknown) {
    console.error('Error extracting text directly from PDF with Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
  }
}

/**
 * Fixes broken concept spans in formatted HTML 
 * Sometimes the LLM incorrectly splits concepts across multiple spans
 * @param html The formatted HTML with potential broken spans
 * @returns Fixed HTML with properly joined concept spans
 */
function fixBrokenConceptSpans(html: string): string {
  // First pass: identify and mark spans with the same concept index
  const spanRegex = /<span class="highlighted-concept" data-concept-index="(\d+)"[^>]*>([^<]*)<\/span>/g;
  const conceptSpans: Record<string, string[]> = {};
  
  // Find all concept spans and group by index
  let match;
  let originalHtml = html;
  while ((match = spanRegex.exec(originalHtml)) !== null) {
    const [fullMatch, conceptIndex, content] = match;
    if (!conceptSpans[conceptIndex]) {
      conceptSpans[conceptIndex] = [];
    }
    conceptSpans[conceptIndex].push(fullMatch);
  }
  
  // Identify duplicate concept references (same text highlighted multiple times)
  const duplicateTexts = new Set<string>();
  Object.values(conceptSpans).forEach(spans => {
    const texts = spans.map(span => {
      const contentMatch = span.match(/>([^<]*)<\/span>/);
      return contentMatch ? contentMatch[1] : '';
    });
    
    // Check for duplicates
    texts.forEach(text => {
      if (text && texts.filter(t => t === text).length > 1) {
        duplicateTexts.add(text);
      }
    });
  });
  
  // Second pass: fix consecutive spans with the same concept index
  let fixedHtml = html;
  for (const conceptIndex in conceptSpans) {
    const spans = conceptSpans[conceptIndex];
    if (spans.length <= 1) continue;
    
    // Check for spans that should be merged (text fragments of the same concept)
    for (let i = 0; i < spans.length; i++) {
      for (let j = i + 1; j < spans.length; j++) {
        // Check if these spans are adjacent in the HTML with only whitespace between
        const span1 = spans[i];
        const span2 = spans[j];
        const span1End = fixedHtml.indexOf(span1) + span1.length;
        const span2Start = fixedHtml.indexOf(span2);
        
        // If spans are adjacent or have only whitespace between them
        if (span2Start > span1End && span2Start - span1End < 20) {
          const textBetween = fixedHtml.substring(span1End, span2Start);
          // If spans are adjacent or separated only by whitespace/simple text
          if (/^\s*$/.test(textBetween) || textBetween.length < 5) {
            // Extract content from both spans
            const span1Content = span1.match(/>([^<]*)<\/span>/)?.[1] || '';
            const span2Content = span2.match(/>([^<]*)<\/span>/)?.[1] || '';
            const attributes = span1.match(/<span([^>]*)>/)?.[1] || '';
            
            // Create merged span
            const mergedSpan = `<span${attributes}>${span1Content}${textBetween}${span2Content}</span>`;
            
            // Replace the two spans and text between with merged span
            const toReplace = span1 + textBetween + span2;
            fixedHtml = fixedHtml.replace(toReplace, mergedSpan);
            
            // Update the current span to the merged span
            spans[i] = mergedSpan;
            // Remove the second span as it's now merged
            spans.splice(j, 1);
            j--; // Adjust index after removal
          }
        }
      }
    }
  }
  
  // Handle duplicate concept references - keep only the first instance of each duplicate
  if (duplicateTexts.size > 0) {
    // A new temporary HTML to work with
    let tempHtml = fixedHtml;
    
    duplicateTexts.forEach(duplicateText => {
      if (!duplicateText) return;
      
      // Find all instances of this duplicate text
      const escapedText = duplicateText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const duplicateRegex = new RegExp(`<span class="highlighted-concept" data-concept-index="(\\d+)"[^>]*>${escapedText}<\\/span>`, 'g');
      
      const instances: string[] = [];
      while ((match = duplicateRegex.exec(tempHtml)) !== null) {
        instances.push(match[0]);
      }
      
      // Keep only the first instance, replace others with just the text
      if (instances.length > 1) {
        for (let i = 1; i < instances.length; i++) {
          tempHtml = tempHtml.replace(instances[i], duplicateText);
        }
      }
    });
    
    fixedHtml = tempHtml;
  }
  
  return fixedHtml;
}

/**
 * Ensures the exact original text is used for concepts
 * @param text The original text
 * @param concepts Array of concepts with offsets
 * @returns Concepts with exact text extracted from original
 */
function getExactConceptTexts(
  text: string, 
  concepts: { title: string; description: string; startOffset: number; endOffset: number; }[]
): { title: string; description: string; text: string; index: number; }[] {
  // Sort concepts by their position in the text
  const sortedConcepts = [...concepts].sort((a, b) => a.startOffset - b.startOffset);
  
  // Extract the exact text for each concept
  return sortedConcepts.map((concept, index) => {
    // Get the exact text from the original
    const conceptText = text.substring(concept.startOffset, concept.endOffset);
    
    return {
      title: concept.title,
      description: concept.description,
      text: conceptText,
      index: index // Use the sorted index to avoid duplicate highlighting
    };
  });
}

/**
 * Split text into chunks of 2-3 paragraphs, ensuring no concepts are split across chunks
 * @param text The text to split into chunks
 * @param concepts Array of concepts with their positions
 * @returns Array of text chunks, each containing 2-3 paragraphs
 */
function splitTextIntoChunks(
  text: string,
  concepts: { title: string; description: string; text: string; index: number; startOffset?: number; endOffset?: number; }[] = []
): { chunk: string; startOffset: number; endOffset: number }[] {
  // First, enhance the concepts with their offsets if not already present
  const enhancedConcepts = concepts.map(concept => {
    if (concept.startOffset !== undefined && concept.endOffset !== undefined) {
      return concept;
    }
    // Find the position of this concept in the text
    const startOffset = text.indexOf(concept.text);
    if (startOffset !== -1) {
      return {
        ...concept,
        startOffset,
        endOffset: startOffset + concept.text.length
      };
    }
    return concept;
  }).filter(c => c.startOffset !== undefined && c.endOffset !== undefined);
  
  // Sort concepts by their position
  const sortedConcepts = [...enhancedConcepts].sort((a, b) => 
    (a.startOffset || 0) - (b.startOffset || 0)
  );
  
  // Split by paragraph breaks (common paragraph separators)
  const paragraphs = text.split(/\n{2,}|\r\n{2,}|(?:\r\n|\n){2,}/);
  
  // Initialize chunks array
  const chunks: { chunk: string; startOffset: number; endOffset: number }[] = [];
  let currentChunk = '';
  let paragraphCount = 0;
  let currentStartOffset = 0;
  
  // Track the last end position in original text
  let lastEndPosition = 0;
  
  // Keep track of concepts assigned to chunks
  const conceptsInChunks = new Set<number>();
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    
    // Skip empty paragraphs
    if (!paragraph.trim()) continue;
    
    // Find the actual position of this paragraph in the original text
    const paragraphStart = text.indexOf(paragraph, lastEndPosition);
    if (paragraphStart === -1) continue; // Skip if paragraph not found
    
    const paragraphEnd = paragraphStart + paragraph.length;
    
    // Update last position
    lastEndPosition = paragraphEnd;
    
    // Set the actual start offset for the first paragraph in the chunk
    if (paragraphCount === 0) {
      currentStartOffset = paragraphStart;
    }
    
    // Add paragraph to current chunk
    if (currentChunk) {
      // Add paragraph separators between paragraphs in a chunk
      currentChunk += '\n\n' + paragraph;
    } else {
      currentChunk = paragraph;
    }
    
    paragraphCount++;
    
    // Check if we should end this chunk
    const shouldEndChunk = paragraphCount >= 3 || i === paragraphs.length - 1;
    
    // But first, check if any concepts span across the current chunk boundary
    // If we're thinking about ending the chunk, check if any concepts would be split
    if (shouldEndChunk && i < paragraphs.length - 1) {
      const potentialEndOffset = paragraphEnd;
      
      // Find concepts that would be split by this chunk boundary
      const conceptsSpanningBoundary = sortedConcepts.filter(concept => {
        const start = concept.startOffset || 0;
        const end = concept.endOffset || 0;
        
        // A concept spans the boundary if it starts before or at the boundary
        // and ends after the boundary
        return start <= potentialEndOffset && end > potentialEndOffset && !conceptsInChunks.has(concept.index);
      });
      
      // If there are concepts that would be split, don't end the chunk yet
      // unless we've already got too many paragraphs
      if (conceptsSpanningBoundary.length > 0 && paragraphCount < 5) {
        continue;
      }
    }
    
    // End the chunk if we've reached target paragraph count or last paragraph
    if (shouldEndChunk) {
      // Calculate the actual end offset based on the last position
      const chunkEndOffset = paragraphEnd;
      
      // Identify concepts fully included in this chunk
      sortedConcepts.forEach(concept => {
        const start = concept.startOffset || 0;
        const end = concept.endOffset || 0;
        
        // If the concept is fully contained in this chunk, mark it as assigned
        if (start >= currentStartOffset && end <= chunkEndOffset) {
          conceptsInChunks.add(concept.index);
        }
      });
      
      // Store the chunk with its position information
      chunks.push({
        chunk: currentChunk,
        startOffset: currentStartOffset,
        endOffset: chunkEndOffset
      });
      
      // Reset for the next chunk
      currentChunk = '';
      paragraphCount = 0;
    }
  }
  
  // Check for any unassigned concepts
  const unassignedConcepts = sortedConcepts.filter(concept => !conceptsInChunks.has(concept.index));
  
  // If we have unassigned concepts, make sure they're included in at least one chunk
  if (unassignedConcepts.length > 0) {
    console.log(`${unassignedConcepts.length} concepts were not fully contained in any chunk. Adding overlapping chunks.`);
    
    // For each unassigned concept, create a special chunk that contains it
    for (const concept of unassignedConcepts) {
      if (!concept.startOffset || !concept.endOffset) continue;
      
      // Extract a reasonable amount of context around the concept
      const contextStart = Math.max(0, concept.startOffset - 300);
      const contextEnd = Math.min(text.length, concept.endOffset + 300);
      
      // Extract the text for this special chunk
      const conceptChunk = text.substring(contextStart, contextEnd);
      
      // Add as a special chunk
      chunks.push({
        chunk: conceptChunk,
        startOffset: contextStart,
        endOffset: contextEnd
      });
      
      // Mark as assigned
      conceptsInChunks.add(concept.index);
    }
  }
  
  return chunks;
}

/**
 * Format a single chunk of text using Gemini
 * @param chunk The text chunk to format
 * @param conceptTextsToHighlight Array of concepts with their texts to highlight
 * @param model The Gemini model to use
 * @returns Promise with the formatted HTML for this chunk
 */
async function formatChunk(
  chunk: { chunk: string; startOffset: number; endOffset: number },
  conceptTextsToHighlight: { title: string; description: string; text: string; index: number; startOffset?: number; endOffset?: number; }[],
  model: any
): Promise<string> {
  try {
    // Filter concepts that might be in this chunk
    // A concept is considered relevant if it overlaps with the chunk at all
    const relevantConcepts = conceptTextsToHighlight.filter(concept => {
      const conceptText = concept.text;
      // Check if this concept appears in this chunk
      return chunk.chunk.includes(conceptText);
    });
    
    // Log relevant concepts for debugging
    console.log(`Chunk from ${chunk.startOffset} to ${chunk.endOffset} has ${relevantConcepts.length} relevant concepts`);
    
    // Create the prompt with clear instructions
    const prompt = `#INPUT_TEXT
${chunk.chunk}
#END_INPUT_TEXT

${relevantConcepts.length > 0 ? `
#CONCEPTS_TO_HIGHLIGHT
${JSON.stringify(relevantConcepts)}
#END_CONCEPTS_TO_HIGHLIGHT
` : ''}

Convert the text between #INPUT_TEXT and #END_INPUT_TEXT into well-formatted HTML.

Requirements:
- Preserve ALL original content exactly (word-for-word)
- Convert section titles to heading elements (<h1>, <h2>, etc.)
- Make key terms and concepts bold with <strong> tags
- Use <em> for emphasis
- Structure content with appropriate <p>, <ul>, <ol>, <li> tags
- Group related content with <section> or <div> tags
- Use <blockquote> for quotes or examples
${relevantConcepts.length > 0 ? `
- For each concept in CONCEPTS_TO_HIGHLIGHT:
  - Wrap ONLY the EXACT text with this format: <span class="highlighted-concept" data-concept-index="[index]" data-concept-title="[title]">[text]</span>
  - The data-concept-index attribute must contain the exact index provided
  - Treat each concept as a SINGLE, INDIVISIBLE unit - NEVER split a concept across multiple spans
  - When the same concept text appears multiple times, mark ONLY the FIRST occurrence
  - If concepts have overlapping words, prioritize the concept that starts first in the text

CRITICAL REQUIREMENTS FOR CONCEPTS:
1. DO NOT break words or phrases across multiple spans
2. Each concept MUST be wrapped in EXACTLY ONE span element
3. DO NOT create multiple spans for parts of the same concept
4. DO NOT modify the text inside the span in any way
5. When highlighting a concept, include the FULL words at both start and end
6. ALWAYS use the EXACT TEXT provided in the CONCEPTS_TO_HIGHLIGHT
` : ''}
- The output MUST ONLY contain the formatted HTML
- DO NOT add any paragraph or block tags that would create additional space between this chunk and adjacent chunks

DO NOT include any meta-commentary, instructions, or explanations.
DO NOT prefix your response with anything like "Here's the formatted HTML".
DO NOT add comments about what you changed.
DO NOT include the #INPUT_TEXT or #END_INPUT_TEXT markers in your response.`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let formattedHtml = response.text();
    
    // Clean up the response
    // First, try to extract content between first < and last >
    const htmlContentMatch = formattedHtml.match(/<[\s\S]*>/);
    if (htmlContentMatch) {
      formattedHtml = htmlContentMatch[0];
    }
    
    // Additional cleanup to remove any markers that shouldn't be in the output
    formattedHtml = formattedHtml
      // Remove markdown code blocks if present
      .replace(/```html\s+|```\s*$/g, '')
      // Remove any markers
      .replace(/#INPUT_TEXT|#END_INPUT_TEXT|#CONCEPTS_TO_HIGHLIGHT|#END_CONCEPTS_TO_HIGHLIGHT/g, '')
      // Remove any "Here's the formatted HTML" or similar text
      .replace(/^(here'?s|here is|the formatted|formatted) (html|content|text)[:\s]*/i, '')
      // Remove any "Requirements:" sections
      .replace(/Requirements:[\s\S]*?(-|•)[\s\S]*?\n\n/g, '')
      // Trim whitespace
      .trim();
    
    // Fix broken concept spans
    if (relevantConcepts.length > 0) {
      formattedHtml = fixBrokenConceptSpans(formattedHtml);
    }
    
    return formattedHtml;
  } catch (error) {
    console.error('Error formatting chunk:', error);
    // Return a simple paragraph with the original chunk in case of error
    return `<p>${chunk.chunk}</p>`;
  }
}

/**
 * Format text for better readability using HTML structure with chunking approach
 * The new implementation processes the text in chunks to improve concept mapping accuracy
 * @param text - The text to format
 * @param concepts - Optional array of concepts with their text positions to highlight
 * @returns Promise with the formatted HTML text
 */
export async function formatTextForReadability(
  text: string, 
  concepts: { title: string; description: string; startOffset: number; endOffset: number; }[] = []
): Promise<string> {
  try {
    // Use the Gemini 2.0 Flash model for text formatting
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Extract concept texts to highlight using our helper function
    const conceptTextsToHighlight = getExactConceptTexts(text, concepts);
    
    // Log concepts for debugging
    console.log(`Processing ${conceptTextsToHighlight.length} concepts for highlighting`);
    
    // Split the text into chunks of 2-3 paragraphs, passing concepts to avoid splitting them
    const chunks = splitTextIntoChunks(text, conceptTextsToHighlight);
    
    // Log the chunks for debugging
    console.log(`Text split into ${chunks.length} chunks`);
    chunks.forEach((chunk, i) => {
      console.log(`Chunk ${i+1}: ${chunk.startOffset}-${chunk.endOffset}, length: ${chunk.chunk.length}`);
    });
    
    // Process each chunk in parallel
    const formattedChunks = await Promise.all(
      chunks.map(chunk => formatChunk(chunk, conceptTextsToHighlight, model))
    );
    
    // Combine the formatted chunks into a single HTML document
    let combinedHtml = formattedChunks.join('');
    
    // Make sure it's properly wrapped in a container
    if (!combinedHtml.startsWith('<')) {
      combinedHtml = `<div>${combinedHtml}</div>`;
    } else if (!combinedHtml.startsWith('<div') && !combinedHtml.startsWith('<section')) {
      // Wrap in a div if not already wrapped in a block container
      combinedHtml = `<div>${combinedHtml}</div>`;
    }
    
    // Add custom styles for highlighted concepts
    if (conceptTextsToHighlight.length > 0) {
      const highlightStyles = `
<style>
.highlighted-concept {
  border-bottom: 2px solid #38BDF8;
  cursor: pointer;
  padding: 0 2px;
  transition: border-color 0.3s ease;
}
.highlighted-concept:hover {
  border-bottom: 2px solid #64D3FF;
}
.highlighted-concept.active {
  border-bottom: 2px solid #8DEBFF;
  font-weight: 500;
}
</style>`;
      combinedHtml = highlightStyles + combinedHtml;
    }
    
    return combinedHtml;
  } catch (error) {
    console.error('Error formatting text:', error);
    throw new Error('Failed to format text');
  }
}