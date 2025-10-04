/**
 * Keyboard shortcut definitions
 */

export type KeyboardShortcut = {
  key: string;
  description: string;
  modifier?: 'ctrl' | 'alt' | 'shift' | 'meta';
};

// Navigation shortcuts
export const NAVIGATION_SHORTCUTS: Record<string, KeyboardShortcut> = {
  NEXT_CONCEPT: {
    key: 'ArrowRight',
    description: 'Go to next concept',
  },
  PREVIOUS_CONCEPT: {
    key: 'ArrowLeft',
    description: 'Go to previous concept',
  },
  NEXT_CONCEPT_ALT: {
    key: 'ArrowDown',
    description: 'Go to next concept',
  },
  PREVIOUS_CONCEPT_ALT: {
    key: 'ArrowUp',
    description: 'Go to previous concept',
  },
  EXPAND_VISUALIZATION: {
    key: 'e',
    description: 'Expand visualization',
  },
};

// Action shortcuts
export const ACTION_SHORTCUTS: Record<string, KeyboardShortcut> = {
  PUSH_TO_TALK: {
    key: 'Space',
    description: 'Push to talk (voice assistant)',
  },
  CLOSE_MODAL: {
    key: 'Escape',
    description: 'Close current modal',
  },
  VISUALIZE: {
    key: 'Enter',
    modifier: 'ctrl',
    description: 'Generate visualization',
  },
  NEW_VISUALIZATION: {
    key: 'n',
    modifier: 'ctrl',
    description: 'Start new visualization',
  },
  REFRESH_FORMATTING: {
    key: 'r',
    modifier: 'ctrl',
    description: 'Refresh text formatting',
  },
};

// Check if a keyboard event matches a shortcut
export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const keyMatches = event.key === shortcut.key;
  
  if (!keyMatches) return false;
  
  // Check modifiers if specified
  if (shortcut.modifier === 'ctrl' && !event.ctrlKey) return false;
  if (shortcut.modifier === 'alt' && !event.altKey) return false;
  if (shortcut.modifier === 'shift' && !event.shiftKey) return false;
  if (shortcut.modifier === 'meta' && !event.metaKey) return false;
  
  return true;
}

// Get all shortcuts as a flat array
export function getAllShortcuts(): KeyboardShortcut[] {
  return [
    ...Object.values(NAVIGATION_SHORTCUTS),
    ...Object.values(ACTION_SHORTCUTS)
  ];
} 