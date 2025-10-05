import { supabase } from '../../lib/supabase';

// Get backend API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

/**
 * API Client for communicating with the backend
 * Handles authentication and error responses
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the current user's auth token
   */
  private async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  /**
   * Make an authenticated request to the backend
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Request failed',
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      }));

      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Generic POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<{ data: T }> {
    const result = await this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    // Wrap result in { data } to match expected format
    return { data: result };
  }

  /**
   * Generate SVG visualization
   */
  async generateSVG(
    concept: { title: string; description: string },
    type: 'diagram' | 'flowchart' | 'concept' | 'technical' | 'neural-network' | 'mindmap' = 'concept',
    model: 'claude' | 'gemini' = 'gemini'
  ): Promise<{ svg: string; model: string }> {
    return this.request('/api/ai/generate-svg', {
      method: 'POST',
      body: JSON.stringify({ concept, type, model }),
    });
  }

  /**
   * Extract concepts from text
   */
  async extractConcepts(text: string): Promise<{ concepts: Array<{ title: string; description: string }> }> {
    return this.request('/api/ai/extract-concepts', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  /**
   * Extract concepts with position information from text
   */
  async extractConceptsWithRanges(
    text: string
  ): Promise<{
    concepts: Array<{
      title: string;
      description: string;
      startOffset: number;
      endOffset: number;
    }>;
  }> {
    return this.request('/api/ai/extract-concepts-with-ranges', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  /**
   * Format text for readability
   */
  async formatText(
    text: string,
    concepts?: Array<{
      title: string;
      description: string;
      startOffset: number;
      endOffset: number;
    }>
  ): Promise<{ formattedHtml: string }> {
    return this.request('/api/ai/format-text', {
      method: 'POST',
      body: JSON.stringify({ text, concepts }),
    });
  }

  /**
   * Extract text from PDF
   */
  async extractPDFText(pdfData: string): Promise<{ text: string }> {
    return this.request('/api/ai/extract-pdf-text', {
      method: 'POST',
      body: JSON.stringify({ pdfData }),
    });
  }

  /**
   * Answer question with context
   */
  async answerQuestion(
    question: string,
    context: string,
    conversationHistory?: Array<{ type: 'question' | 'answer'; text: string }>
  ): Promise<{ answer: string }> {
    return this.request('/api/ai/answer-question', {
      method: 'POST',
      body: JSON.stringify({ question, context, conversationHistory }),
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const url = `${this.baseUrl}/api/health`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return response.json();
  }
}

// Export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

