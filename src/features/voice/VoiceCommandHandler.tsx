import React, { useState, useEffect } from 'react';
import { startSpeechRecognition, stopSpeechRecognition } from '../../services/voice/speechRecognitionUtils';
import { VoiceCommand } from '../../types/app.types';
import { ERROR_MESSAGES } from '../../constants/messages';

// Define types for voice commands
type CommandAction = () => void;

interface VoiceCommandHandlerProps {
  isActive: boolean;
  commands: VoiceCommand[];
  onCommandDetected?: (command: string) => void;
  onError?: (error: string) => void;
}

const VoiceCommandHandler: React.FC<VoiceCommandHandlerProps> = ({
  isActive,
  commands,
  onCommandDetected,
  onError
}) => {
  const [isListening, setIsListening] = useState(false);
  
  // Process detected speech to match commands
  const processTranscript = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Check each command's keywords for a match
    for (const command of commands) {
      const matchedKeyword = command.keywords.find(keyword => 
        lowerTranscript.includes(keyword.toLowerCase())
      );
      
      if (matchedKeyword) {
        // Execute the command action
        command.action();
        
        // Notify parent component
        if (onCommandDetected) {
          onCommandDetected(matchedKeyword);
        }
        
        // Stop listening after detecting a command
        stopListening();
        return;
      }
    }
  };
  
  // Start listening for commands
  const startListening = () => {
    const result = startSpeechRecognition(
      // We don't need interim results
      () => {},
      // Process final transcript
      (finalTranscript) => {
        processTranscript(finalTranscript);
      }
    );
    
    setIsListening(result.isRecording);
    if (result.error && onError) {
      onError(result.error);
    }
  };
  
  // Stop listening for commands
  const stopListening = () => {
    stopSpeechRecognition();
    setIsListening(false);
  };
  
  // Toggle listening when active state changes
  useEffect(() => {
    if (isActive && !isListening) {
      startListening();
    } else if (!isActive && isListening) {
      stopListening();
    }
    
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isActive]);
  
  // Component is purely functional with no UI
  return null;
};

export default VoiceCommandHandler; 