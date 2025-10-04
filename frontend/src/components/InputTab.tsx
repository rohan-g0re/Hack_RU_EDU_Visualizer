import React from 'react';
import { Globe, Loader, Zap, FileText, Sparkles } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useConceptContext } from '../contexts/ConceptContext';
import { useDocumentProcessor } from '../hooks/useDocumentProcessor';
import MathFormulaAnimation from './MathFormulaAnimation';

interface InputTabProps {
  className?: string;
}

const InputTab: React.FC<InputTabProps> = ({ className = '' }) => {
  // Get state and handlers from contexts
  const {
    inputText,
    setInputText,
    isLoading,
    error,
    statusMessage,
  } = useAppContext();
  
  const {
    pendingConcepts,
    results,
    currentlyProcessingIndex,
    processingIndices,
    completedIndices,
    handleVisualize,
    visualizationModel,
    setVisualizationModel
  } = useConceptContext();

  // Use document processor hook
  const {
    handleUrlSubmit,
    getRootProps,
    getInputProps,
    isDragActive
  } = useDocumentProcessor();

  return (
    <>
      <MathFormulaAnimation />
      <div className={`space-y-8 max-w-7xl mx-auto p-4 md:p-6 content-fade-in relative z-10 ${className}`}>
        {/* Main Content Container - Flex layout for side-by-side display */}
        <div className={`flex flex-col ${pendingConcepts.length > 0 ? 'lg:flex-row lg:gap-6' : ''}`}>
          {/* Left Side - Create Visualization Block */}
          <div className={`${pendingConcepts.length > 0 ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}>
            <div className="bg-gradient-to-br from-[#0F172A]/70 via-[#064E3B]/70 to-[#030712]/70 rounded-2xl p-6 md:p-8 shadow-xl border border-emerald-900/20 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10">
              <div className="flex flex-col space-y-6 relative z-10">
                <h2 className="text-2xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#0EA5E9] font-['Manrope']">
                  Create a New Visualization
                </h2>
                
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter URL or paste text for visualization"
                      className="w-full p-4 pl-10 rounded-xl bg-gradient-to-b from-[#0F172A]/90 to-[#030712]/90 border border-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-emerald-800/30 focus:border-emerald-800 transition-all duration-300 placeholder-gray-400 shadow-sm text-white font-['SF Pro Text', -apple-system, BlinkMacSystemFont, 'Manrope']"
                    />
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-600/80" />
                  </div>
                  
                  {inputText.startsWith('http') && (
                    <button
                      onClick={handleUrlSubmit}
                      disabled={isLoading}
                      className="px-5 py-4 bg-gradient-to-r from-[#065F46] to-[#0D9488] rounded-xl hover:shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-800/30 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-['SF Pro Text', -apple-system, BlinkMacSystemFont, 'Manrope'] font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5" />
                          <span>Fetch</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <div className="relative flex items-center justify-center">
                  <div className="flex-grow border-t border-emerald-900/20"></div>
                  <span className="flex-shrink mx-4 text-gray-400 font-medium font-['SF Pro Text', -apple-system, BlinkMacSystemFont, 'Manrope']">OR</span>
                  <div className="flex-grow border-t border-emerald-900/20"></div>
                </div>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed ${isDragActive ? 'border-emerald-600 bg-emerald-900/10' : 'border-emerald-900/30 hover:border-emerald-700/50'} rounded-xl p-8 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden bg-gradient-to-b from-[#0F172A]/60 to-[#030712]/60`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-emerald-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDragActive ? 'opacity-100' : ''}`}></div>
                  <input {...getInputProps()} />
                  <FileText className="w-16 h-16 mx-auto mb-4 text-emerald-600 group-hover:text-emerald-500 transition-all duration-300 group-hover:scale-110" />
                  <p className="text-lg font-medium text-white font-['SF Pro Display', -apple-system, BlinkMacSystemFont, 'Manrope']">Upload a PDF</p>
                  <p className="text-sm text-gray-400 mt-2 font-['SF Pro Text', -apple-system, BlinkMacSystemFont, 'Manrope']">Drag & drop or click to select</p>
                </div>

                {/* Model Selector with gradient */}
                <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-[#0F172A]/90 to-[#030712]/90 rounded-lg p-3 border border-emerald-900/30">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm0-8h-2V7h2v2zm-4 0H9V7h2v2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-300 font-['SF Pro Text', -apple-system, BlinkMacSystemFont, 'Manrope']">Visualization Model:</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVisualizationModel('gemini')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors font-['SF Pro Text', -apple-system, BlinkMacSystemFont, 'Manrope'] ${
                        visualizationModel === 'gemini'
                          ? 'bg-gradient-to-r from-[#065F46] to-[#0D9488] text-white'
                          : 'bg-[#0F172A] border border-emerald-900/30 hover:bg-[#1E293B] text-gray-300'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M8 6.236l-.304.304a1 1 0 0 1-1.4 0L3.95 4.192a1 1 0 0 1 0-1.415l2.346-2.347a1 1 0 0 1 1.4 0L8 .735V6.236Zm.794 5.67-2.347-2.347a1 1 0 0 1 0-1.415l2.347-2.347a1 1 0 0 1 1.415 0l2.347 2.347a1 1 0 0 1 0 1.415l-2.347 2.347a1 1 0 0 1-1.415 0ZM3.192 20.05l-2.347-2.347a1 1 0 0 1 0-1.415l2.347-2.347a1 1 0 0 1 1.415 0l2.347 2.347a1 1 0 0 1 0 1.415l-.304.304h-3.46v2Zm5.602 0-2.347-2.347a1 1 0 0 1 0-1.415l2.347-2.347a1 1 0 0 1 1.415 0l2.347 2.347a1 1 0 0 1 0 1.415l-2.347 2.347a1 1 0 0 1-1.415 0Zm5.602-5.602-2.347-2.347a1 1 0 0 1 0-1.415l2.347-2.347a1 1 0 0 1 1.415 0l2.347 2.347a1 1 0 0 1 0 1.415l-2.347 2.347a1 1 0 0 1-1.415 0Zm6.396 3.97a1 1 0 0 1-1.415 0l-2.347-2.347a1 1 0 0 1 0-1.415l2.347-2.347a1 1 0 0 1 1.415 0l2.347 2.347a1 1 0 0 1 0 1.415l-2.347 2.347Zm.002-11.204a1 1 0 0 1-1.415 0l-2.347-2.347a1 1 0 0 1 0-1.415l2.347-2.347a1 1 0 0 1 1.415 0l2.347 2.347a1 1 0 0 1 0 1.415l-2.347 2.347Z" />
                      </svg>
                      Simple
                    </button>
                    <button
                      onClick={() => setVisualizationModel('claude')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors font-['SF Pro Text', -apple-system, BlinkMacSystemFont, 'Manrope'] ${
                        visualizationModel === 'claude'
                          ? 'bg-gradient-to-r from-[#D4AF37] via-[#F0E68C] to-[#FFD700] text-black'
                          : 'bg-[#0F172A] border border-emerald-900/30 hover:bg-[#1E293B] text-gray-300'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                      </svg>
                      Advanced
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleVisualize}
                  disabled={isLoading || !inputText.trim()}
                  className={`w-full py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-md backdrop-blur-sm font-['SF Pro Display', -apple-system, BlinkMacSystemFont, 'Manrope'] relative overflow-hidden
                    ${isLoading || !inputText.trim()
                      ? 'bg-gray-800/30 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#10B981] via-[#0F766E] to-[#1E40AF] text-white hover:shadow-lg hover:shadow-emerald-900/20 hover:scale-[1.01] active:scale-[0.99]'}`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000 pointer-events-none"></span>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-5 w-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Visualize
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Pending Concepts List */}
          {pendingConcepts.length > 0 && (
            <div className={`lg:w-1/3 transition-all duration-300 animate-fadeIn`}>
              <div className="bg-gradient-to-br from-[#0F172A]/70 via-[#064E3B]/70 to-[#030712]/70 rounded-2xl p-6 md:p-8 shadow-xl border border-emerald-900/20 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10 h-full">
                <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#0EA5E9] font-['Manrope']">
                  Generating Visualizations
                </h3>
                <div className="space-y-4">
                  {pendingConcepts.map((concept, index) => {
                    const isProcessed = completedIndices.has(index);
                    const isProcessing = processingIndices.has(index);
                    
                    return (
                      <div 
                        key={`${concept.title}-${index}`}
                        className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${
                          isProcessed 
                            ? 'bg-[#10B981]/10 border border-[#10B981]/30' 
                            : isProcessing
                              ? 'bg-[#112240] border border-blue-800/30 animate-pulse' 
                              : 'bg-[#112240]/60 border border-blue-800/20'
                        }`}
                      >
                        {isProcessed ? (
                          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#10B981] flex items-center justify-center shadow-md animate-check-appear">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : isProcessing ? (
                          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#38BDF8] flex items-center justify-center shadow-md">
                            <Loader className="w-4 h-4 text-white animate-spin" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[#112240] border border-blue-800/30 shadow-md" />
                        )}
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{concept.title}</h4>
                          <p className="text-sm text-gray-400 line-clamp-2">{concept.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InputTab; 