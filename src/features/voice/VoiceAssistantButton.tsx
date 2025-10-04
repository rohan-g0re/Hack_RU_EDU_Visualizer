import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceAssistantButtonProps {
  onClick: () => void;
  className?: string;
}

const VoiceAssistantButton: React.FC<VoiceAssistantButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-2 bg-[#38BDF8] rounded-full hover:bg-[#5096FF] transition-colors shadow-lg hover:shadow-[#38BDF8]/20 ${className}`}
      aria-label="Voice Assistant"
      title="Ask questions about this text (Voice Assistant)"
    >
      <Mic size={20} className="text-white" />
    </button>
  );
};

export default VoiceAssistantButton; 