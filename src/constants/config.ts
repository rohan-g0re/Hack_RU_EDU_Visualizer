/**
 * Application configuration constants
 */

// API configuration
export const API_CONFIG = {
  GEMINI_MODEL: 'gemini-2.0-flash',
  CLAUDE_MODEL: 'claude-3-opus-20240229',
  REQUEST_TIMEOUT: 60000, // 60 seconds
  MAX_TOKENS: 4000,
};

// UI configuration
export const UI_CONFIG = {
  MAX_VISUALIZATION_RESULTS: 7,
  SVG_DIMENSIONS: {
    WIDTH: '100%',
    HEIGHT: '100%',
    VIEWBOX: '0 0 800 600',
  },
  ANIMATION_DURATION: 300, // ms
  TOOLTIP_DELAY: 500, // ms
  SPEECH_RECOGNITION_TIMEOUT: 10000, // 10 seconds
};

// PDF configuration
export const PDF_CONFIG = {
  WORKER_PATH: 'node_modules/pdfjs-dist/build/pdf.worker.mjs',
  SCALE: 1.5, // Scale for rendering PDF to canvas
  IMAGE_QUALITY: 0.8, // JPEG quality for PDF images
};

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#38BDF8',
  PRIMARY_DARK: '#0284C7',
  SECONDARY: '#5096FF',
  BACKGROUND_DARK: '#0A192F',
  BACKGROUND_LIGHT: '#112240',
  ACCENT: '#8DEBFF',
  ERROR: '#FF5252',
  WARNING: '#FFD740',
  SUCCESS: '#4CAF50',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A1A1AA',
  BORDER: 'rgba(56, 189, 248, 0.3)',
}; 