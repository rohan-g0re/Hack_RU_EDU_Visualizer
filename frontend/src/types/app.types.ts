/**
 * Application-wide type definitions
 */

import { ReactNode } from 'react';

/**
 * Application tab types
 */
export type AppTab = 'input' | 'visualization';

/**
 * Basic component props with children
 */
export interface WithChildren {
  children: ReactNode;
}

/**
 * Base component props with optional className
 */
export interface BaseComponentProps {
  className?: string;
}

/**
 * Properties for voice assistant components
 */
export interface VoiceAssistantProps {
  textContext: string;
  isOpen: boolean;
  onClose: () => void;
  isListening?: boolean;
}

/**
 * Result from speech recognition start
 */
export interface SpeechRecognitionResult {
  isRecording: boolean;
  error?: string;
}

/**
 * Voice command definition
 */
export interface VoiceCommand {
  keywords: string[];
  action: () => void;
  description: string;
}

/**
 * Button component properties
 */
export interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  isLoading?: boolean;
  children?: ReactNode;
} 