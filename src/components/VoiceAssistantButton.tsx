import React from 'react';
import { Mic, MessageSquare } from 'lucide-react';

interface VoiceAssistantButtonProps {
  onClick: () => void;
  className?: string;
}

const VoiceAssistantButton: React.FC<VoiceAssistantButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-3 bg-gradient-to-r from-[#38BDF8] to-[#5096FF] rounded-full hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-[#38BDF8]/30 ${className}`}
      aria-label="Voice and Chat Assistant"
      title="Open Voice and Chat Assistant"
    >
      <div className="relative">
        <Mic size={24} className="text-white" />
        <MessageSquare size={14} className="text-white absolute -top-1 -right-1 bg-[#5096FF] rounded-full p-0.5" />
      </div>
    </button>
  );
};

export default VoiceAssistantButton; 