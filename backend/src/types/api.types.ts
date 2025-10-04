import { Request } from 'express';

// Extended Express Request with user info
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// AI Service Request/Response Types
export interface GenerateSVGRequest {
  concept: {
    title: string;
    description: string;
  };
  type?: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap';
  model: 'claude' | 'gemini';
}

export interface GenerateSVGResponse {
  svg: string;
  model: string;
}

export interface ExtractConceptsRequest {
  text: string;
}

export interface Concept {
  title: string;
  description: string;
}

export interface ExtractConceptsResponse {
  concepts: Concept[];
}

export interface ConceptWithRange {
  title: string;
  description: string;
  startOffset: number;
  endOffset: number;
}

export interface ExtractConceptsWithRangesRequest {
  text: string;
}

export interface ExtractConceptsWithRangesResponse {
  concepts: ConceptWithRange[];
}

export interface FormatTextRequest {
  text: string;
  concepts?: Array<{
    title: string;
    description: string;
    startOffset: number;
    endOffset: number;
  }>;
}

export interface FormatTextResponse {
  formattedHtml: string;
}

export interface ExtractPDFTextRequest {
  pdfData: string; // Base64 encoded PDF
}

export interface ExtractPDFTextResponse {
  text: string;
}

export interface AnswerQuestionRequest {
  question: string;
  context: string;
  conversationHistory?: Array<{
    type: 'question' | 'answer';
    text: string;
  }>;
}

export interface AnswerQuestionResponse {
  answer: string;
}

// Error Response
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

