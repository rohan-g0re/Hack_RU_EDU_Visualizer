import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Loader } from 'lucide-react';
import { startSpeechRecognition, stopSpeechRecognition } from '../../services/voice/speechRecognitionUtils';
import { answerQuestionWithContext } from '../../services/ai/gemini';
import { VoiceAssistantProps } from '../../types/app.types';
import { ERROR_MESSAGES, STATUS_MESSAGES, PLACEHOLDERS } from '../../constants/messages';
import { matchesShortcut, ACTION_SHORTCUTS } from '../../constants/keyboardShortcuts';

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ textContext, isOpen, onClose, isListening = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalQuestion, setFinalQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle push-to-talk button
  const handlePushToTalk = () => {
    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
    } else {
      const result = startSpeechRecognition(
        // Interim results callback
        (interimTranscript) => {
          setTranscript(interimTranscript);
        },
        // Final transcript callback
        (finalTranscript) => {
          setFinalQuestion(finalTranscript);
          processQuestion(finalTranscript);
        }
      );
      
      setIsRecording(result.isRecording);
      if (result.error) {
        setError(result.error);
      }
    }
  };
  
  // Start recording
  const startRecording = () => {
    if (!isRecording) {
      const result = startSpeechRecognition(
        // Interim results callback
        (interimTranscript) => {
          setTranscript(interimTranscript);
        },
        // Final transcript callback
        (finalTranscript) => {
          setFinalQuestion(finalTranscript);
          processQuestion(finalTranscript);
        }
      );
      
      setIsRecording(result.isRecording);
      if (result.error) {
        setError(result.error);
      }
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
    }
  };
  
  // Process the question and get answer
  const processQuestion = async (question: string) => {
    if (!question.trim()) return;
    
    // Stop recording first
    stopSpeechRecognition();
    setIsRecording(false);
    
    setIsLoading(true);
    try {
      const response = await answerQuestionWithContext(question, textContext);
      setAnswer(response);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.QUESTION_ANSWER_FAILED);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset the assistant
  const resetAssistant = () => {
    setTranscript('');
    setFinalQuestion('');
    setAnswer('');
    setError(null);
    stopSpeechRecognition();
    setIsRecording(false);
  };
  
  // Handle spacebar push-to-talk via prop
  useEffect(() => {
    if (!isOpen) return;
    
    if (isListening && !isRecording) {
      startRecording();
    } else if (!isListening && isRecording) {
      stopRecording();
    }
  }, [isListening, isOpen]);
  
  // Handle spacebar push-to-talk
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if spacebar is pressed and not in an input/textarea field
      if (matchesShortcut(e, ACTION_SHORTCUTS.PUSH_TO_TALK) && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault(); // Prevent page scrolling
        startRecording();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Only trigger if spacebar is released and not in an input/textarea field
      if (matchesShortcut(e, ACTION_SHORTCUTS.PUSH_TO_TALK) && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        stopRecording();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, startRecording, stopRecording]);
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (matchesShortcut(e, ACTION_SHORTCUTS.CLOSE_MODAL)) {
        resetAssistant();
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, resetAssistant]);

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}
      
      {/* User question */}
      {finalQuestion && (
        <div className="mb-4">
          <div className="font-medium text-gray-300 mb-1">You asked:</div>
          <div className="p-3 bg-[#1E3A5F] rounded-lg text-white">
            {finalQuestion}
          </div>
        </div>
      )}
      
      {/* Speech recognition status */}
      {isRecording && (
        <div className="mb-4 p-3 bg-[#38BDF8]/10 border border-[#38BDF8]/30 rounded-lg animate-pulse">
          <div className="flex items-center gap-2 mb-2 text-[#38BDF8]">
            <Mic size={18} />
            <span className="font-medium">{STATUS_MESSAGES.LISTENING}</span>
          </div>
          <div className="text-white">{transcript || PLACEHOLDERS.SPEAK_NOW}</div>
        </div>
      )}
      
      {/* AI response */}
      {isLoading ? (
        <div className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <Loader size={32} className="text-[#38BDF8] animate-spin mb-3" />
            <div className="text-gray-300">{STATUS_MESSAGES.THINKING}</div>
          </div>
        </div>
      ) : answer ? (
        <div>
          <div className="font-medium text-gray-300 mb-1">Answer:</div>
          <div className="p-4 bg-[#0A192F] border border-[#38BDF8]/20 rounded-lg text-white whitespace-pre-wrap">
            <div dangerouslySetInnerHTML={{ __html: answer }} />
          </div>
        </div>
      ) : null}
      
      <div className="mt-auto pt-4 flex flex-col items-center">
        <button
          onClick={handlePushToTalk}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 shadow-lg font-medium text-white ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-[#38BDF8] to-[#5096FF] hover:shadow-[#38BDF8]/20'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff size={18} />
              Stop Listening
            </>
          ) : (
            <>
              <Mic size={18} />
              Push to Talk
            </>
          )}
        </button>
        <div className="text-xs text-gray-400 mt-2 text-center">
          Or hold down the <kbd className="px-2 py-1 bg-gray-800 rounded">Space</kbd> key to speak
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant; 