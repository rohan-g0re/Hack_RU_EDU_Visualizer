import React, { useRef } from 'react';
import { Brain, RefreshCw, ChevronLeft, ChevronRight, Maximize2, BookOpen, Globe, Loader, Mic, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useConceptContext } from '../contexts/ConceptContext';
import { useVoiceContext } from '../contexts/VoiceContext';
import { useTextHighlighting } from '../hooks/useTextHighlighting';
import ConceptVisualizer from '../features/concept/ConceptVisualizer';
import VoiceAssistant from './VoiceAssistant';

interface VisualizationTabProps {
  className?: string;
  onNewVisualization: () => void;
}

const VisualizationTab: React.FC<VisualizationTabProps> = ({ 
  className = '',
  onNewVisualization 
}) => {
  // Get state and handlers from contexts
  const {
    inputText,
    formattedText,
    isFormatting,
    setIsExpandedView,
    statusMessage
  } = useAppContext();
  
  const {
    results,
    activeConceptIndex,
    handlePreviousConcept,
    handleNextConcept,
    regenerateConcept,
    regenerateConceptWithClaude
  } = useConceptContext();

  const {
    isVoiceAssistantOpen,
    toggleVoiceAssistant,
    closeVoiceAssistant,
    isHoldingSpace
  } = useVoiceContext();

  // Use text highlighting hook
  const {
    textContainerRef,
    textRef,
    refreshFormatting,
    renderTextWithHighlights
  } = useTextHighlighting();

  return (
    <div className={`flex flex-col h-[calc(100vh-48px)] animate-fadeIn ${className}`}>
      <div className="flex items-center justify-between px-6 py-3 bg-[#112240] border-b border-blue-800/30">
        <div className="flex items-center gap-3">
          {/* Empty div to maintain layout */}
        </div>
        
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-[#38BDF8]" />
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] via-[#64B5F6] to-[#8DEBFF] tracking-tight">
            Nous<span className="text-[#64B5F6]">.</span><span className="font-extrabold">AI</span>
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onNewVisualization}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A192F]/60 border border-blue-800/30 rounded-full hover:bg-[#1E3A5F] transition-all duration-300 text-white/90 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            <span className="hidden sm:inline">New Visualization</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row flex-1 bg-[#0A192F] overflow-hidden">
        {/* Section 1: Text Area (40% when assistant open, 50% when closed) */}
        <div className={`w-full ${isVoiceAssistantOpen ? 'lg:w-[40%]' : 'lg:w-[50%]'} p-4 md:p-6 bg-[#0A192F] flex flex-col border-b lg:border-b-0 lg:border-r border-blue-800/30 h-full animate-slideUp animation-delay-300 transition-all duration-300`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#38BDF8]" />
              <h3 className="text-lg font-semibold text-gray-100">Content</h3>
            </div>
          </div>
          
          {inputText.startsWith('http') && (
            <div className="relative mb-4">
              <input
                type="text"
                value={inputText}
                readOnly
                className="w-full p-2 pl-8 rounded-lg bg-[#112240] border border-blue-800/30 text-gray-300 text-sm overflow-hidden overflow-ellipsis"
              />
              <Globe className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#38BDF8]/80" />
            </div>
          )}
          
          <div 
            ref={textContainerRef}
            className="flex-1 overflow-y-auto pr-2 md:pr-4 custom-scrollbar relative" 
          >
            {isFormatting && (
              <div className="absolute inset-0 bg-[#0A192F]/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="flex flex-col items-center bg-[#112240] p-6 rounded-xl shadow-md border border-blue-800/30">
                  <Loader className="w-10 h-10 text-[#38BDF8] animate-spin mb-3" />
                  <span className="text-gray-300">Formatting text...</span>
                </div>
              </div>
            )}
            <div 
              ref={textRef}
              className="text-gray-300 website-text-container"
            >
              {formattedText ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: formattedText }} 
                  className="formatted-text-container" 
                />
              ) : (
                renderTextWithHighlights()
              )}
            </div>
          </div>
        </div>
        
        {/* Section 2: Visualization Section (40% when assistant open, 50% when closed) */}
        <div className={`w-full ${isVoiceAssistantOpen ? 'lg:w-[40%]' : 'lg:w-[50%]'} bg-[#0D1320] p-4 md:p-6 flex flex-col border-b lg:border-b-0 border-blue-800/30 h-full overflow-hidden animate-slideUp animation-delay-500 transition-all duration-300`}>
          {results.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[#38BDF8]" />
                  <h3 className="text-lg font-semibold text-gray-100">
                    {results[activeConceptIndex]?.conceptTitle}
                  </h3>
                </div>
                <button
                  onClick={toggleVoiceAssistant}
                  className={`flex items-center gap-2 px-4 py-2 
                    ${isVoiceAssistantOpen 
                      ? 'bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white shadow-[0_0_15px_rgba(56,189,248,0.6)]' 
                      : 'bg-gradient-to-r from-[#112240] to-[#1E3A5F] text-[#38BDF8] hover:text-white border border-[#38BDF8]/50 hover:border-[#38BDF8]/80'
                    } 
                    rounded-full text-sm md:text-base font-medium transition-all duration-300 relative group overflow-hidden
                    hover:shadow-lg hover:scale-105 transform`}
                  title={isVoiceAssistantOpen ? "Close assistant" : "Open assistant"}
                  aria-label="Toggle AI assistant"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#38BDF8]/20 to-[#6C9CFF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <div className={`relative flex items-center justify-center p-1.5 rounded-full 
                    ${isVoiceAssistantOpen 
                      ? 'bg-white/20' 
                      : 'bg-[#38BDF8]/10 group-hover:bg-[#38BDF8]/20'} 
                    transition-all duration-300 mr-1`}>
                    <Mic className={`h-4 w-4 ${isVoiceAssistantOpen ? 'animate-pulse' : 'group-hover:animate-bounce-subtle'}`} />
                  </div>
                  <span className="relative z-10 font-semibold">Assistant</span>
                  {!isVoiceAssistantOpen && 
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#38BDF8] rounded-full animate-ping-slow"></span>
                  }
                </button>
              </div>
              
              <div 
                className="flex-1 overflow-hidden flex items-center justify-center bg-[#0A192F]/80 p-4 shadow-lg border border-blue-800/30 relative rounded-lg transition-all duration-500 hover:shadow-xl hover:shadow-[#38BDF8]/20"
                key={`visualization-${activeConceptIndex}`}
                style={{ minHeight: "500px" }}
              >
                <div className="absolute inset-0 bg-[#38BDF8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {results.length > 0 && activeConceptIndex >= 0 && activeConceptIndex < results.length ? (
                  <ConceptVisualizer 
                    concept={results[activeConceptIndex]} 
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                      <line x1="7" y1="2" x2="7" y2="22"></line>
                      <line x1="17" y1="2" x2="17" y2="22"></line>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <line x1="2" y1="7" x2="7" y2="7"></line>
                      <line x1="2" y1="17" x2="7" y2="17"></line>
                      <line x1="17" y1="17" x2="22" y2="17"></line>
                      <line x1="17" y1="7" x2="22" y2="7"></line>
                    </svg>
                    <p className="mt-4 text-gray-400">No visualization selected</p>
                  </div>
                )}
              </div>
              
              {results.length > 1 && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePreviousConcept}
                    disabled={activeConceptIndex === 0}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#112240] border border-blue-800/30 hover:bg-[#1E3A5F] rounded-lg disabled:bg-[#0A192F]/50 disabled:text-gray-500 disabled:border-blue-800/20 transition-colors text-gray-300"
                    aria-label="Previous concept"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center justify-center px-3 py-1 bg-[#112240] rounded-lg shadow-md border border-blue-800/30">
                    <span className="text-[#38BDF8] font-medium">{activeConceptIndex + 1}</span>
                    <span className="mx-1 text-gray-500">/</span>
                    <span className="text-gray-300">{results.length}</span>
                  </div>
                  
                  <button
                    onClick={handleNextConcept}
                    disabled={activeConceptIndex === results.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#112240] border border-blue-800/30 hover:bg-[#1E3A5F] rounded-lg disabled:bg-[#0A192F]/50 disabled:text-gray-500 disabled:border-blue-800/20 transition-colors text-gray-300"
                    aria-label="Next concept"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {/* Expand Button */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setIsExpandedView(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#112240] border border-blue-800/30 hover:bg-[#1E3A5F] rounded-lg text-gray-300 transition-colors"
                  aria-label="Expand visualization"
                >
                  <Maximize2 className="h-4 w-4" />
                  Expand
                </button>
              </div>
              
              {/* Regenerate button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => regenerateConcept(activeConceptIndex)}
                  className="flex items-center gap-2 text-sm bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] hover:opacity-90 text-white px-3 py-2 rounded-md transition-all shadow-md hover:shadow-lg hover:shadow-[#38BDF8]/20 mr-3"
                  title="Generate a new visualization for this concept"
                >
                  <RefreshCw size={16} />
                  Simple
                </button>
                
                <button
                  onClick={() => regenerateConceptWithClaude(activeConceptIndex)}
                  className="flex items-center gap-2 text-sm bg-gradient-to-r from-[#D4AF37] via-[#F0E68C] to-[#FFD700] text-black px-3 py-2 rounded-md transition-all shadow-md hover:shadow-lg hover:shadow-[#D4AF37]/20"
                  title="Generate visualization"
                >
                  <RefreshCw size={16} />
                  Advanced
                </button>
              </div>
            </>
          )}
        </div>

        {/* Section 3: Voice Assistant Panel (20% width when open) */}
        {isVoiceAssistantOpen && (
          <div className="w-full lg:w-[20%] bg-[#0A192F] border-l border-[#38BDF8]/30 flex flex-col h-full overflow-hidden transition-all duration-300 animate-slide-in-right relative">
            <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-[#38BDF8] via-[#6C9CFF] to-[#38BDF8] animate-pulse-slow"></div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#112240] to-[#1E3A5F] border-b border-blue-800/30 shadow-md">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#38BDF8]/10 rounded-lg border border-[#38BDF8]/30">
                  <Mic className="h-4 w-4 text-[#38BDF8] animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] to-[#8DEBFF]">Assistant</h3>
              </div>
              <button 
                onClick={closeVoiceAssistant} 
                className="text-gray-400 hover:text-[#38BDF8] transition-colors p-1.5 rounded-full hover:bg-[#38BDF8]/10"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <VoiceAssistant 
                textContext={inputText || "No content available"}
                isOpen={isVoiceAssistantOpen}
                onClose={closeVoiceAssistant}
                isListening={isHoldingSpace}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationTab; 