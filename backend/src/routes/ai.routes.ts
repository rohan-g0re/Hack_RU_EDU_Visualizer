import { Router, Response } from 'express';
import { AuthenticatedRequest, GenerateSVGRequest, ExtractConceptsRequest, FormatTextRequest, ExtractPDFTextRequest, AnswerQuestionRequest } from '../types/api.types';
import * as claudeService from '../services/claude.service';
import * as geminiService from '../services/gemini.service';

const router = Router();

/**
 * Generate SVG visualization
 * POST /api/ai/generate-svg
 */
router.post('/generate-svg', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { concept, type = 'concept', model = 'gemini' }: GenerateSVGRequest = req.body;

    // Validate request
    if (!concept || !concept.title || !concept.description) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: concept.title and concept.description',
        statusCode: 400,
      });
      return;
    }

    let svg: string;

    // Generate SVG using the specified model
    if (model === 'claude') {
      svg = await claudeService.generateSingleConceptSvg(concept, type);
    } else {
      svg = await geminiService.generateSingleConceptSvgWithGemini(concept, type);
    }

    res.status(200).json({
      svg,
      model,
    });
  } catch (error) {
    console.error('Error generating SVG:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to generate SVG',
      statusCode: 500,
    });
  }
});

/**
 * Extract concepts from text
 * POST /api/ai/extract-concepts
 */
router.post('/extract-concepts', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text }: ExtractConceptsRequest = req.body;

    // Validate request
    if (!text || typeof text !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: text',
        statusCode: 400,
      });
      return;
    }

    // Extract concepts using Claude
    const concepts = await claudeService.extractConcepts(text);

    res.status(200).json({
      concepts,
    });
  } catch (error) {
    console.error('Error extracting concepts:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to extract concepts',
      statusCode: 500,
    });
  }
});

/**
 * Extract concepts with position information from text
 * POST /api/ai/extract-concepts-with-ranges
 */
router.post('/extract-concepts-with-ranges', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text } = req.body;

    // Validate request
    if (!text || typeof text !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: text',
        statusCode: 400,
      });
      return;
    }

    // Extract concepts with ranges using Gemini
    const concepts = await geminiService.extractConceptsWithRanges(text);

    res.status(200).json({
      concepts,
    });
  } catch (error) {
    console.error('Error extracting concepts with ranges:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to extract concepts with ranges',
      statusCode: 500,
    });
  }
});

/**
 * Format text for readability
 * POST /api/ai/format-text
 */
router.post('/format-text', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, concepts = [] }: FormatTextRequest = req.body;

    // Validate request
    if (!text || typeof text !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: text',
        statusCode: 400,
      });
      return;
    }

    // Format text using Gemini
    const formattedHtml = await geminiService.formatTextForReadability(text, concepts);

    res.status(200).json({
      formattedHtml,
    });
  } catch (error) {
    console.error('Error formatting text:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to format text',
      statusCode: 500,
    });
  }
});

/**
 * Extract text from PDF
 * POST /api/ai/extract-pdf-text
 */
router.post('/extract-pdf-text', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { pdfData }: ExtractPDFTextRequest = req.body;

    // Validate request
    if (!pdfData || typeof pdfData !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: pdfData (base64 encoded PDF)',
        statusCode: 400,
      });
      return;
    }

    // Extract text from PDF using Gemini
    const text = await geminiService.extractTextFromPdfDirectly(pdfData);

    res.status(200).json({
      text,
    });
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to extract text from PDF',
      statusCode: 500,
    });
  }
});

/**
 * Answer question with context
 * POST /api/ai/answer-question
 */
router.post('/answer-question', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { question, context, conversationHistory = [] }: AnswerQuestionRequest = req.body;

    // Validate request
    if (!question || typeof question !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: question',
        statusCode: 400,
      });
      return;
    }

    if (!context || typeof context !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: context',
        statusCode: 400,
      });
      return;
    }

    // Answer question using Gemini
    const answer = await geminiService.answerQuestionWithContext(question, context, conversationHistory);

    res.status(200).json({
      answer,
    });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to answer question',
      statusCode: 500,
    });
  }
});

export default router;

