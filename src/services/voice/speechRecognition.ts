/**
 * Speech recognition service for handling push-to-talk functionality
 */

// Define the Web Speech API interface for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
  onaudiostart: () => void;
  onsoundstart: () => void;
  onspeechstart: () => void;
  onspeechend: () => void;
  onsoundend: () => void;
  onaudioend: () => void;
  grammars: SpeechGrammarList;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechGrammarList {
  length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

// Extend Window interface to include the SpeechRecognition API
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
    mozSpeechRecognition: SpeechRecognitionConstructor;
    msSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// Check if Speech Recognition is supported
export function isSpeechRecognitionSupported(): boolean {
  return !!(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition
  );
}

// Get Speech Recognition constructor
function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    null
  );
}

// Speech Recognition Class
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private finalTranscript: string = '';
  private interimTranscript: string = '';
  private onResultCallback: (final: string, interim: string) => void = () => {};
  private onEndCallback: () => void = () => {};
  private onErrorCallback: (error: string) => void = () => {};
  private autoRestart: boolean = false;
  private restartTimeout: number | null = null;

  constructor() {
    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();
    if (SpeechRecognitionConstructor) {
      this.recognition = new SpeechRecognitionConstructor();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      this.interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          this.finalTranscript += ' ' + transcript;
        } else {
          this.interimTranscript += transcript;
        }
      }
      
      // Clean up the transcripts
      this.finalTranscript = this.finalTranscript.trim();
      this.interimTranscript = this.interimTranscript.trim();
      
      this.onResultCallback(this.finalTranscript, this.interimTranscript);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      
      // If autoRestart is enabled and we're still supposed to be listening,
      // attempt to restart after a short delay
      if (this.autoRestart && this.restartTimeout === null) {
        this.restartTimeout = window.setTimeout(() => {
          this.restartTimeout = null;
          if (this.autoRestart) {
            this.start();
          }
        }, 300);
      } else {
        this.onEndCallback();
      }
    };

    this.recognition.onerror = (event) => {
      const errorMessage = event.error || 'Unknown speech recognition error';
      this.onErrorCallback(errorMessage);
    };
  }

  public start(autoRestart: boolean = true): boolean {
    if (!this.recognition) {
      this.onErrorCallback('Speech recognition is not supported in this browser');
      return false;
    }

    // Add check to prevent starting if already listening
    if (this.isListening) {
      console.log('Speech recognition is already active');
      return true;
    }

    try {
      this.autoRestart = autoRestart;
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.onErrorCallback('Failed to start speech recognition');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.autoRestart = false;
      this.recognition.stop();
      if (this.restartTimeout !== null) {
        clearTimeout(this.restartTimeout);
        this.restartTimeout = null;
      }
    }
  }

  public clear(): void {
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.onResultCallback('', '');
  }

  public getTranscript(): { final: string; interim: string } {
    return {
      final: this.finalTranscript,
      interim: this.interimTranscript,
    };
  }

  public onResult(callback: (final: string, interim: string) => void): void {
    this.onResultCallback = callback;
  }

  public onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  public onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public isActive(): boolean {
    return this.isListening;
  }
} 