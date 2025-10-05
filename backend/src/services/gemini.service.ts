import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.config';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);

interface VisualizationPrompt {
  text: string;
  type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap';
}

/**
 * Generate SVG for a single concept using Gemini 2.5 Flash
 */
export async function generateSingleConceptSvgWithGemini(
  concept: { title: string; description: string },
  type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap' = 'concept'
): Promise<string> {
  const prompt = `${concept.title}: ${concept.description}`;
  return await generateSvgVisualizationWithGemini({ text: prompt, type });
}

/**
 * Convert text to a visual representation using Gemini 2.5 Flash
 */
export async function generateSvgVisualizationWithGemini({ text, type }: VisualizationPrompt): Promise<string> {
  try {
    // Use Gemini SVG-specific model (2.5 Flash) for SVG generation
    const model = genAI.getGenerativeModel({ model: config.ai.geminiSvgModel });

    const prompt = `You are an expert at creating precise, technical SVG visualizations optimized for digital displays.
    
    visualization_type: ${type}
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
 */
export async function answerQuestionWithContext(
  question: string,
  context: string,
  conversationHistory: { type: 'question' | 'answer'; text: string }[] = []
): Promise<string> {
  try {
    // Use Gemini model from config for accurate answers
    const model = genAI.getGenerativeModel({ model: config.ai.geminiModel });

    // Format previous conversation for the prompt
    const previousConversation =
      conversationHistory.length > 0
        ? `\nPREVIOUS CONVERSATION:\n${conversationHistory
            .map((item) => `${item.type === 'question' ? 'USER' : 'ASSISTANT'}: ${item.text}`)
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
      .map((paragraph) => {
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
 * Extract concepts with position information from text
 */
export async function extractConceptsWithRanges(
  text: string
): Promise<Array<{ title: string; description: string; startOffset: number; endOffset: number }>> {
  try {
    const model = genAI.getGenerativeModel({ model: config.ai.geminiModel });

    const prompt = `Analyze the following text and identify the important concepts or technical topics with their positions:

${text}

Pay special attention to:
1. Algorithmic processes and workflows
2. Data structures and their relationships
3. System architectures and components
4. Mathematical models and their parameters
5. Statistical relationships and correlations
6. Technical hierarchies and taxonomies

Rules:
1. Only extract concepts that are actually present in the text
2. For short text with only one concept, return just that single concept
3. For longer text, extract only the important concepts (max 5-7)
4. Do not invent or add concepts that aren't directly found in the text
5. Make sure to identify COMPLETE words and phrases, not partial ones
6. The startOffset and endOffset must capture entire words, not parts of words
7. Ensure concepts DO NOT overlap with each other
8. Do not extract the same concept multiple times
9. Avoid extracting concepts that are too similar to each other

For each concept:
1. Provide a concise title (max 4-5 words)
2. Write a 1-2 sentence description explaining the concept
3. Identify the startOffset (character position where this concept starts in the original text)
4. Identify the endOffset (character position where this concept ends in the original text)

Format your response as valid JSON with this structure:
[{
  "title": "concept title",
  "description": "concept description",
  "startOffset": number,
  "endOffset": number
}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Extract the JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }

    const concepts = JSON.parse(jsonMatch[0]);

    // Validate the response
    if (!Array.isArray(concepts) || concepts.length === 0) {
      throw new Error('Invalid concept extraction response');
    }

    // Validate and filter concepts
    const validConcepts = concepts.filter(
      (c) =>
        typeof c.title === 'string' &&
        typeof c.description === 'string' &&
        typeof c.startOffset === 'number' &&
        typeof c.endOffset === 'number'
    );

    return validConcepts;
  } catch (error) {
    console.error('Error extracting concepts with ranges:', error);
    throw new Error('Failed to extract concepts with position information');
  }
}

// Removed unused helper function to satisfy noUnusedLocals

/**
 * Extract text from a PDF file using Gemini
 */
export async function extractTextFromPdfDirectly(pdfBase64: string): Promise<string> {
  try {
    // Use the Gemini model from config for PDF processing
    const model = genAI.getGenerativeModel({ model: config.ai.geminiModel });

    // Create a file part for the model
    const filePart = {
      inlineData: {
        data: pdfBase64,
        mimeType: 'application/pdf',
      },
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
Just extract the text with its original formatting preserved.`,
            },
            filePart,
          ],
        },
      ],
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
 * Format text for better readability using HTML structure
 */
export async function formatTextForReadability(
  text: string,
  concepts: { title: string; description: string; startOffset: number; endOffset: number }[] = []
): Promise<string> {
  try {
    // Use the Gemini model from config for text formatting
    const model = genAI.getGenerativeModel({ model: config.ai.geminiModel });

    // Extract concept texts to highlight
    const conceptTextsToHighlight = concepts.map((concept, index) => ({
      title: concept.title,
      description: concept.description,
      text: text.substring(concept.startOffset, concept.endOffset),
      index: index,
    }));

    // Create the prompt with clear instructions
    const prompt = `#INPUT_TEXT
${text}
#END_INPUT_TEXT

${
  conceptTextsToHighlight.length > 0
    ? `
#CONCEPTS_TO_HIGHLIGHT
${JSON.stringify(conceptTextsToHighlight)}
#END_CONCEPTS_TO_HIGHLIGHT
`
    : ''
}

Convert the text between #INPUT_TEXT and #END_INPUT_TEXT into well-formatted HTML.

Requirements:
- Preserve ALL original content exactly (word-for-word)
- Convert section titles to heading elements (<h1>, <h2>, etc.)
- Make key terms and concepts bold with <strong> tags
- Use <em> for emphasis
- Structure content with appropriate <p>, <ul>, <ol>, <li> tags
- Group related content with <section> or <div> tags
- Use <blockquote> for quotes or examples
${
  conceptTextsToHighlight.length > 0
    ? `
- For each concept in CONCEPTS_TO_HIGHLIGHT:
  - Wrap ONLY the EXACT text with this format: <span class="highlighted-concept" data-concept-index="[index]" data-concept-title="[title]">[text]</span>
  - The data-concept-index attribute must contain the exact index provided
  - Treat each concept as a SINGLE, INDIVISIBLE unit - NEVER split a concept across multiple spans
  - When the same concept text appears multiple times, mark ONLY the FIRST occurrence
  - If concepts have overlapping words, prioritize the concept that starts first in the text
`
    : ''
}
- The output MUST ONLY contain the formatted HTML
- DO NOT include any meta-commentary, instructions, or explanations.

DO NOT add comments about what you changed.`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let formattedHtml = response.text();

    // Clean up the response
    formattedHtml = formattedHtml
      .replace(/```html\s+|```\s*$/g, '')
      .replace(/#INPUT_TEXT|#END_INPUT_TEXT|#CONCEPTS_TO_HIGHLIGHT|#END_CONCEPTS_TO_HIGHLIGHT/g, '')
      .trim();

    // Make sure it's properly wrapped in a container
    if (!formattedHtml.startsWith('<')) {
      formattedHtml = `<div>${formattedHtml}</div>`;
    } else if (!formattedHtml.startsWith('<div') && !formattedHtml.startsWith('<section')) {
      formattedHtml = `<div>${formattedHtml}</div>`;
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
      formattedHtml = highlightStyles + formattedHtml;
    }

    return formattedHtml;
  } catch (error) {
    console.error('Error formatting text:', error);
    throw new Error('Failed to format text');
  }
}

