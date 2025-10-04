import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { useConceptContext } from './ConceptContext';

// Define the type for conversation items
export interface ConversationItem {
  type: 'question' | 'answer';
  text: string;
  // Optional source to track if the question came from voice or text input
  source?: 'voice' | 'text';
}

interface VoiceContextType {
  // Voice assistant state
  isVoiceAssistantOpen: boolean;
  toggleVoiceAssistant: () => void;
  closeVoiceAssistant: () => void;
  isHoldingSpace: boolean; // Track if space key is being held
  
  // Conversation history
  conversationHistory: ConversationItem[];
  addToConversation: (item: ConversationItem) => void;
  clearConversation: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const { inputText, formattedText, activeTab } = useAppContext();
  const { results } = useConceptContext();
  
  // Voice assistant state
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [isHoldingSpace, setIsHoldingSpace] = useState<boolean>(false);
  
  // Conversation history state
  const [conversationHistory, setConversationHistory] = useState<ConversationItem[]>([]);
  
  // Add an item to the conversation history
  const addToConversation = (item: ConversationItem) => {
    setConversationHistory(prev => [...prev, item]);
  };
  
  // Clear the conversation history
  const clearConversation = () => {
    setConversationHistory([]);
  };
  
  // Toggle voice assistant
  const toggleVoiceAssistant = () => {
    setIsVoiceAssistantOpen(!isVoiceAssistantOpen);
  };
  
  // Close voice assistant
  const closeVoiceAssistant = () => {
    setIsVoiceAssistantOpen(false);
  };
  
  // Clear conversation history when returning to dashboard (new visualization)
  useEffect(() => {
    if (activeTab === 'input') {
      clearConversation();
    }
  }, [activeTab]);
  
  // Clear conversation history when results change (new visualization)
  useEffect(() => {
    // When results array is reset (length becomes 0), clear conversation
    if (results.length === 0) {
      clearConversation();
    }
  }, [results]);
  
  // Clear conversation history on page load/refresh and listen for storage events
  useEffect(() => {
    // Clear conversation on page load/refresh
    clearConversation();
    
    // Handle page visibility changes (tab switching or page refresh)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        clearConversation();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle beforeunload event (page refresh/close)
    const handleBeforeUnload = () => {
      clearConversation();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Global push-to-talk listener using spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if spacebar is pressed and not in an input/textarea field
      if (e.code === 'Space' && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        // Prevent default behavior like page scrolling
        e.preventDefault();
        
        // If voice assistant isn't open yet, open it
        if (!isVoiceAssistantOpen) {
          setIsVoiceAssistantOpen(true);
        }
        
        // Track that the space key is being held down
        setIsHoldingSpace(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // When space key is released
      if (e.code === 'Space' && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        
        // No longer holding space key
        setIsHoldingSpace(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVoiceAssistantOpen]);
  
  return (
    <VoiceContext.Provider
      value={{
        isVoiceAssistantOpen,
        toggleVoiceAssistant,
        closeVoiceAssistant,
        isHoldingSpace,
        conversationHistory,
        addToConversation,
        clearConversation
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoiceContext() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoiceContext must be used within a VoiceProvider');
  }
  return context;
} 