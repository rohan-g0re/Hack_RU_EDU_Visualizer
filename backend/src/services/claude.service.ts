import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.config';

// Initialize the Anthropic Client (no dangerouslyAllowBrowser flag needed on backend!)
const anthropic = new Anthropic({
  apiKey: config.ai.anthropicApiKey,
});

export interface VisualizationPrompt {
  text: string;
  type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap';
}

export interface Concept {
  title: string;
  description: string;
}

/**
 * Generate SVG for a single concept using Claude
 */
export async function generateSingleConceptSvg(
  concept: { title: string; description: string },
  type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap' = 'concept'
): Promise<string> {
  const prompt = `${concept.title}: ${concept.description}`;
  return await generateSvgVisualization({ text: prompt, type });
}

/**
 * Convert text to a visual representation using Claude
 */
export async function generateSvgVisualization({ text, type }: VisualizationPrompt): Promise<string> {
  try {
    const systemPrompt = `You are an expert technical visualization assistant designed to convert complex technical text into visual representations including neural network diagrams and other technical visualizations.

CRITICAL REQUIREMENTS - your visualization MUST follow these rules:
- Set viewBox to exactly "0 0 1200 900" to provide ample space
- Set SVG width and height to "100%" to fill available space
- All text MUST have substantial margins (at least 30px) from any other element
- Text must NEVER overlap with other text or graphic elements
- Diagram must have at least 150px padding on all sides
- All text must be horizontal and easily readable
- Use larger font sizes (20px minimum) for all text
- Use high-contrast colors on dark backgrounds
- Ensure clean, professional layout with proper spacing between ALL elements

Make it technical with:
- Properly labeled layers (For Example: input, convolution, pooling, fully connected, etc. wherever applicable)
- Flow direction with arrows connecting components
- Clear layer dimensions/sizes where appropriate
- Ensure the diagram has sufficient padding from all sides to prevent content from being cut off

Determine the most appropriate visualization type based on the technical content provided. Consider:
• Neural network diagrams for machine learning processes and architectures
• Flowcharts for sequential processes and decision trees
• Entity relationship diagrams for database structures
• Architecture diagrams for system components
• Graphs and charts for quantitative relationships
• State diagrams for process states and transitions

Technical Accuracy Guidelines
When creating visualizations, prioritize technical accuracy and precision:
• Maintain correct terminology from the source material
• Represent mathematical relationships accurately
• Preserve the logical structure of the original content
• Include all critical components and connections
• Use standard notation and symbols where applicable
• Provide appropriate labels and annotations for clarity

Understand that user is learning the concepts. So make sure the SVG is simple enough but conceptually correct.`;

    const mainPrompt = `Create a visual representation of the following ${type} as a clean, modern SVG:

${text}

Generate ONLY the SVG markup. The SVG should be well-formatted and valid. 
Use a clear visual hierarchy with a pleasing color scheme, and organize elements logically.
Make the visualization intuitive and focused on showing relationships between ideas.
Do not include any explanation text, markdown, or code blocks around your SVG code.
Your response must start with <svg and end with </svg> with no other text before or after.`;

    // Make the API call to Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: mainPrompt }],
    });

    // Extract the SVG code from the response
    const svgResponse = message.content[0].type === 'text' ? message.content[0].text : '';

    // Clean and extract just the SVG code
    const svgMatch = svgResponse.match(/<svg[\s\S]*<\/svg>/);
    if (!svgMatch) {
      console.error('No SVG found in response:', svgResponse);
      throw new Error('Failed to generate SVG visualization');
    }

    // Get clean SVG code
    let svgCode = svgMatch[0];

    // Add viewBox if missing or replace with the larger size
    if (!svgCode.includes('viewBox')) {
      svgCode = svgCode.replace('<svg', '<svg viewBox="0 0 1200 900"');
    } else {
      // Replace any existing viewBox with our required size
      svgCode = svgCode.replace(/viewBox="[^"]*"/, 'viewBox="0 0 1200 900"');
    }

    // Always set explicit width and height attributes regardless of what's in the original SVG
    svgCode = svgCode.replace(/<svg([^>]*)width="[^"]*"/, '<svg$1');
    svgCode = svgCode.replace(/<svg([^>]*)height="[^"]*"/, '<svg$1');
    svgCode = svgCode.replace(/<svg/, '<svg width="100%" height="100%"');

    return svgCode;
  } catch (error) {
    console.error('Error generating SVG visualization:', error);
    throw new Error('Failed to generate SVG visualization');
  }
}

/**
 * Extract concepts from text using Claude
 */
export async function extractConcepts(text: string): Promise<Concept[]> {
  try {
    // Make the API call to Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      system: `You're a concept extraction tool that identifies key concepts, ideas, and processes in text.`,
      messages: [
        {
          role: 'user',
          content: `Analyze the following text and extract 3-7 key technical concepts, ideas, or processes:

${text}

Format your response ONLY as a JSON array with this exact structure:
[
  {
    "title": "Concept name (5 words max)",
    "description": "Brief description of the concept (1-2 sentences)"
  }
]

For each concept:
1. The title should be concise and specific
2. The description should explain the concept clearly
3. Focus on the most important concepts in the text
4. Ensure proper JSON formatting`,
        },
      ],
    });

    // Extract JSON from the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);

    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }

    const concepts: Concept[] = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(concepts) || concepts.length === 0) {
      throw new Error('Invalid concept extraction response');
    }

    return concepts;
  } catch (error) {
    console.error('Error extracting concepts:', error);
    throw new Error('Failed to extract concepts from text');
  }
}

