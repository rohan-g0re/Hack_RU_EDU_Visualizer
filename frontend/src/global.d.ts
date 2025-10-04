/// <reference types="vite/client" />

// Add PDF.js to the window object type
interface Window {
    pdfjsLib: typeof import('pdfjs-dist');
  }

// Web Speech API declarations
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}