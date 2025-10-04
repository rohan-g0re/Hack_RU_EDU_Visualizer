import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Loader, Send, Eye } from 'lucide-react';
import { startSpeechRecognition, stopSpeechRecognition } from '../services/voice/speechRecognitionUtils';
import { answerQuestionWithContext } from '../services/ai/gemini';
import { VoiceAssistantProps } from '../types/app.types';
import { ERROR_MESSAGES, STATUS_MESSAGES, PLACEHOLDERS } from '../constants/messages';
import { matchesShortcut, ACTION_SHORTCUTS } from '../constants/keyboardShortcuts';
import { useVoiceContext, ConversationItem } from '../contexts/VoiceContext';
import { useConceptContext } from '../contexts/ConceptContext';
import { generateSingleConceptSvg } from '../services/ai/claude';
import { useAppContext } from '../contexts/AppContext';

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ textContext, isOpen, onClose, isListening = false }) => {
  const { conversationHistory, addToConversation, clearConversation } = useVoiceContext();
  const { results, setResults, setActiveConceptIndex } = useConceptContext();
  const { setActiveTab } = useAppContext();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom of conversation when it updates
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);
  
  // Handle push-to-talk button
  const handlePushToTalk = () => {
    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
      setTranscript('');
    } else {
      const result = startSpeechRecognition(
        // Interim results callback
        (interimTranscript) => {
          setTranscript(interimTranscript);
        },
        // Final transcript callback
        (finalTranscript) => {
          setCurrentQuestion(finalTranscript);
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
          setCurrentQuestion(finalTranscript);
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
  const processQuestion = async (question: string, source: 'voice' | 'text' = 'voice') => {
    if (!question.trim()) return;
    
    // Stop recording first
    stopSpeechRecognition();
    setIsRecording(false);
    
    setTranscript(''); // Clear the transcript when processing a question
    
    // Add question to conversation history (get the length before adding)
    const currentHistoryLength = conversationHistory.length;
    addToConversation({ type: 'question', text: question, source });
    
    setIsLoading(true);
    try {
      // Get filtered conversation history (exclude the question we just added)
      const previousConversation = conversationHistory.slice(0, currentHistoryLength);
      
      // Pass conversation history to the AI service
      const response = await answerQuestionWithContext(question, textContext, previousConversation);
      
      // Add answer to conversation history
      addToConversation({ type: 'answer', text: response });
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.QUESTION_ANSWER_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit text question
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && !isLoading) {
      processQuestion(textInput, 'text');
      setTextInput('');
    }
  };
  
  // Handle visualization
  const handleVisualize = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isLoading || isVisualizing) return;
    
    setIsVisualizing(true);
    
    try {
      // Extract a meaningful title from the input (first 5-7 words or up to 50 chars)
      const inputWords = textInput.trim().split(/\s+/);
      const titleWords = inputWords.slice(0, Math.min(7, inputWords.length));
      let conceptTitle = titleWords.join(' ');
      
      // If the title is too long, truncate it
      if (conceptTitle.length > 50) {
        conceptTitle = conceptTitle.substring(0, 47) + '...';
      }
      // Capitalize the first letter
      conceptTitle = conceptTitle.charAt(0).toUpperCase() + conceptTitle.slice(1);
      
      // Generate SVG visualization using Claude
      const svg = await generateSingleConceptSvg(
        { title: conceptTitle, description: textInput },
        'concept'
      );
      
      // Add the new visualization to the results array
      const newResults = [
        ...results,
        {
          conceptTitle,
          conceptDescription: textInput,
          startOffset: 0,
          endOffset: 0,
          svg
        }
      ];
      
      setResults(newResults);
      
      // Set the active concept index to the newly added visualization
      const newIndex = newResults.length - 1;
      setActiveConceptIndex(newIndex);
      
      // Switch to the visualization tab
      setActiveTab('visualization');
      
      // Clear the text input after generating visualization
      setTextInput('');
      
      // Add message to conversation history
      addToConversation({ 
        type: 'answer', 
        text: `Visualization for "${conceptTitle}" created successfully! Switching to visualization tab to view it.` 
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate visualization');
    } finally {
      setIsVisualizing(false);
    }
  };
  
  // Reset the assistant
  const resetAssistant = () => {
    setTranscript('');
    setCurrentQuestion('');
    clearConversation();
    setError(null);
    stopSpeechRecognition();
    setIsRecording(false);
    setTextInput('');
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
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col p-4">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}
      
      {/* Conversation history */}
      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
        {conversationHistory.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="font-medium text-gray-300 mb-1 flex items-center">
              {item.type === 'question' ? (
                <>
                  You asked:
                  {item.source && (
                    <span className="ml-2 text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-full">
                      {item.source === 'voice' ? 'Voice' : 'Text'}
                    </span>
                  )}
                </>
              ) : 'Answer:'}
            </div>
            <div className={`p-3 rounded-lg text-white ${
              item.type === 'question' 
                ? 'bg-[#1E3A5F]' 
                : 'bg-[#0A192F] border border-[#38BDF8]/20'
            }`}>
              {item.type === 'question' ? (
                item.text
              ) : (
                <div 
                  className="answer-content prose prose-invert prose-p:my-2 prose-headings:mb-2 prose-headings:mt-4 prose-ul:pl-5 prose-li:pl-0 prose-li:my-1 max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.text }} 
                />
              )}
            </div>
          </div>
        ))}
        <div ref={conversationEndRef} />
      </div>
      
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
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <Loader size={32} className="text-[#38BDF8] animate-spin mb-3" />
            <div className="text-gray-300">{STATUS_MESSAGES.THINKING}</div>
          </div>
        </div>
      )}
      
      {/* Visualizing indicator */}
      {isVisualizing && (
        <div className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <Loader size={32} className="text-[#38BDF8] animate-spin mb-3" />
            <div className="text-gray-300">Generating visualization...</div>
          </div>
        </div>
      )}
      
      {/* Text input for chat */}
      <form onSubmit={handleTextSubmit} className="mb-4">
        <div className="flex items-center gap-2">
          <input
            ref={textInputRef}
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 bg-[#1E3A5F] border border-blue-800/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50"
            disabled={isLoading || isRecording || isVisualizing}
          />
          <button
            type="button"
            onClick={handleVisualize}
            disabled={!textInput.trim() || isLoading || isRecording || isVisualizing}
            className="bg-gradient-to-r from-[#9B5DE5] to-[#C77DFF] hover:opacity-90 text-white p-2 rounded-lg disabled:opacity-50 transition-all"
            title="Visualize text"
          >
            <Eye size={20} />
          </button>
          <button
            type="submit"
            disabled={!textInput.trim() || isLoading || isRecording || isVisualizing}
            className="bg-gradient-to-r from-[#38BDF8] to-[#5096FF] hover:from-[#38BDF8] hover:to-[#3A80DF] text-white p-2 rounded-lg disabled:opacity-50 transition-all"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
      
      <div className="mt-auto pt-4 flex flex-col items-center">
        <button
          onClick={handlePushToTalk}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 shadow-lg font-medium text-white ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-[#38BDF8] to-[#5096FF] hover:shadow-[#38BDF8]/20'
          }`}
          disabled={isLoading}
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
        {conversationHistory.length > 0 && (
          <button
            onClick={resetAssistant}
            className="text-gray-400 hover:text-gray-300 text-sm mt-2"
          >
            Clear conversation
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant; 