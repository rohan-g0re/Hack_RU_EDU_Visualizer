/**
 * Application message constants
 * Centralized location for UI messages
 */

// Error messages
export const ERROR_MESSAGES = {
  PDF_LOAD_FAILED: 'Failed to load PDF processor. PDF functionality may not work.',
  PDF_PROCESS_FAILED: 'Failed to process PDF file',
  PDF_URL_EXTRACTION: 'PDF extraction directly from URLs requires special handling. Try one of these options:\n1. Download the PDF and upload it using the file uploader\n2. Copy text from the PDF and paste it in the input field',
  URL_INVALID: 'Please enter a valid URL starting with http:// or https://',
  URL_FETCH_FAILED: 'Failed to fetch content from URL',
  URL_CONTENT_SHORT: 'The extracted content seems too short. The URL might be protected or require authentication.',
  TEXT_FORMATTING_FAILED: 'Failed to format text for better readability',
  VISUALIZATION_FAILED: 'Failed to generate visualizations',
  SPEECH_RECOGNITION_UNSUPPORTED: 'Speech recognition is not supported in this browser',
  SPEECH_RECOGNITION_FAILED: 'Failed to start speech recognition',
  QUESTION_ANSWER_FAILED: 'Failed to get answer',
  NO_INTERNET_CONNECTION: 'No internet connection detected. Some features may not work properly.',
  GENERAL_ERROR: 'An error occurred. Please try again later.'
};

// Status messages
export const STATUS_MESSAGES = {
  LOADING: 'Loading...',
  PROCESSING_PDF: 'Processing PDF...',
  FETCHING_URL: 'Fetching content from URL...',
  FORMATTING_TEXT: 'Formatting text for better readability...',
  EXTRACTING_CONCEPTS: 'Extracting concepts from text...',
  GENERATING_VISUALIZATIONS: 'Generating visualizations one by one...',
  GENERATING_VISUALIZATION: (index: number, total: number, title: string) => 
    `Generating visualization ${index+1} of ${total}: "${title}"`,
  LISTENING: 'Listening...',
  THINKING: 'Thinking...',
  READY: 'Ready',
  FILE_PROCESSED: (fileName: string) => `Successfully processed ${fileName}`,
  PDF_URL_PROCESSED: 'Successfully processed PDF from URL'
};

// Placeholder texts
export const PLACEHOLDERS = {
  URL_INPUT: 'Enter URL or paste text for visualization',
  FILE_DROP: 'Drag & drop a file here, or click to select',
  FILE_DROP_ACTIVE: 'Drop your file here...',
  SPEAK_NOW: 'Speak now...',
  NO_TEXT: 'No text to display. Please upload a document or enter a URL.',
  NO_VISUALIZATION: 'No visualization available'
};

// Confirmation messages
export const CONFIRMATION_MESSAGES = {
  NEW_VISUALIZATION: 'This visualization will be lost. Do you want to proceed?'
}; 