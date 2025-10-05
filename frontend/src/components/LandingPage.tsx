import React, { useEffect, useRef, useState } from 'react';
import { Brain, ArrowDown, Menu, X, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import backgroundImage from '../assets/landing_page_background.jpg';
import text1Image from '../assets/text1_Image.png';
import text2Image from '../assets/text2_Image.png';
import text3Image from '../assets/text3_Image.png';

interface LandingPageProps {
  onVisualizeClick: () => void;
  scrollToRef?: string;
  onLoginClick: (e: React.MouseEvent) => void;
  onSignupClick: (e: React.MouseEvent) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onVisualizeClick, 
  scrollToRef,
  onLoginClick,
  onSignupClick 
}) => {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll event to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to section based on ref
  useEffect(() => {
    if (scrollToRef === 'hero') {
      heroSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (scrollToRef === 'services') {
      secondSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (scrollToRef === 'results') {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToRef]);
  
  // Calculate background darkness based on scroll position
  const backgroundOpacity = Math.min(0.7 + (scrollY / 1000), 0.95);
  
  // Handle visualize button click - check authentication first
  const handleVisualizeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      // User not logged in - show login modal
      onLoginClick(e);
      return;
    }
    
    // User is authenticated - proceed to app
    setFadeOut(true);
    setTimeout(() => {
      onVisualizeClick();
    }, 500); // Duration of fade animation
  };
  
  // Scroll to second section
  const scrollToSecondSection = () => {
    secondSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Navigation click handlers
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    heroSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    secondSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResultsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-['Manrope'] bg-[#0A0E17] text-white flex flex-col relative transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      {/* Background image with blur and vignette */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Background image with blur - centered */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[12px] transform translate-y-[-5%]"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        
        {/* Dynamic background darkness based on scroll */}
        <div 
          className="absolute inset-0 bg-[#0A0E17] transition-opacity duration-300"
          style={{ opacity: backgroundOpacity }}
        ></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-vignette"></div>
        
        {/* Additional gradient effects */}
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[60%] bg-blue-700 rounded-full mix-blend-multiply filter blur-[150px] opacity-10"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-purple-700 rounded-full mix-blend-multiply filter blur-[150px] opacity-10"></div>
        <div className="absolute h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgzMnYzMkgweicvPjxwYXRoIGQ9J00yNCA1LjE1OWEuNDk1LjQ5NSAwIDAgMC0uNDc5LS4xMjdsLTE2Ljg5IDMuOTg2YS41NS41NSAwIDAgMC0uMjg2LjE5LjUzNC41MzQgMCAwIDAtLjExLjMwMmwtLjA2MyA1LjUyYS41MjcuNTI3IDAgMCAwIC4yMjIuNDUuNjIuNjIgMCAwIDAgLjI4Ni4wOTUuNzEuNzEgMCAwIDAgLjIwNi0uMDMybDUuNTU2LTEuOTM3djMuNzczbC0xLjI3LjcxNWEuNTQ3LjU0NyAwIDAgMC0uMjU0LjMyNy41MjcuNTI3IDAgMCAwIC4wMzIuNDA2Yy4xMjcuMjIyLjQxMy4yODYuNjM1LjE1OGwxLjY1LS45MTcgMS42NTEuOTE3YS42My42MyAwIDAgMCAuMjg2LjA2NC41Mi41MiAwIDAgMCAuMzQ5LS4xOWMuMDYzLS4wNjMuMTI3LS4xNTkuMTI3LS4yNTRhLjU3OS41NzkgMCAwIDAtLjAzMi0uMjIyLjU0Mi41NDIgMCAwIDAtLjI1My0uMzI3bC0xLjI3LS43MTV2LTIuOTIzbDcuMTQzLTIuNDkxLjAxOSA0LjM1YS41NDMuNTQzIDAgMCAwIC4yMjIuNDVjLjA5NS42My4xODkuMDk1LjI4Ni4wOTVhLjcxLjcxIDAgMCAwIC4yMDYtLjAzMmw1LjU1Ni0xLjkzN2EuNTQ3LjU0NyAwIDAgMCAuMjg2LS4xOS41MTQuNTE0IDAgMCAwIC4xMS0uMzAybC0uMDMyLTUuNjEzYS40OTUuNDk1IDAgMCAwLS4xOS0uMzQ5ek03Ljc0NiAxMS4xMzVsNi4wNjctMS40MjlWMTQuNTlsLTYuMDY3IDIuMTI3di01LjU4MnptMTYuNDEgMy4wNDlsLTQuNTQuMDk1LjA2My0zLjk1NSA0LjU0MS0xLjY1MXY1LjUxMXonIGZpbGw9J2N1cnJlbnRDb2xvcicgb3BhY2l0eT0nMC4xJy8+PC9zdmc+')]"></div>
      </div>

      {/* First Section - Hero */}
      <div ref={heroSectionRef} className="min-h-screen relative flex flex-col">
        {/* Header */}
        <header className="relative z-10 py-4 px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
            <Brain className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold">VizKidd</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" onClick={handleHomeClick} className="text-white/80 hover:text-white transition">Home</a>
            <a href="#" onClick={handleServicesClick} className="text-white/80 hover:text-white transition">Services</a>
            <a href="#" onClick={handleResultsClick} className="text-white/80 hover:text-white transition">Results</a>
            <a href="#" className="text-white/80 hover:text-white transition">About Us</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button 
                  onClick={handleVisualizeClick}
                  className="px-4 py-2 bg-gradient-to-r from-[#38BDF8] to-[#6C9CFF] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#38BDF8]/30 transition-all"
                >
                  Go to App
                </button>
              </>
            ) : (
              <>
                <a href="#" onClick={onLoginClick} className="text-white/90 hover:text-white font-medium transition">Log In</a>
                <a href="#" onClick={onSignupClick} className="px-4 py-2 bg-white text-[#0A0E17] font-semibold rounded-full hover:bg-white/90 transition">Sign Up</a>
              </>
            )}
            <button className="md:hidden text-white/90" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="absolute top-16 right-0 p-4 w-64 bg-[#112240] border border-blue-800/30 shadow-xl rounded-bl-xl animate-slideIn">
              <nav className="flex flex-col space-y-2 mb-4">
                <a href="#" onClick={(e) => { handleHomeClick(e); setMobileMenuOpen(false); }} className="px-4 py-3 text-white/80 hover:text-white hover:bg-[#1E3A5F] rounded-lg transition-colors">Home</a>
                <a href="#" onClick={(e) => { handleServicesClick(e); setMobileMenuOpen(false); }} className="px-4 py-3 text-white/80 hover:text-white hover:bg-[#1E3A5F] rounded-lg transition-colors">Services</a>
                <a href="#" onClick={(e) => { handleResultsClick(e); setMobileMenuOpen(false); }} className="px-4 py-3 text-white/80 hover:text-white hover:bg-[#1E3A5F] rounded-lg transition-colors">Results</a>
                <a href="#" className="px-4 py-3 text-white/80 hover:text-white hover:bg-[#1E3A5F] rounded-lg transition-colors">About Us</a>
              </nav>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-12 text-center">
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight animate-slideUp">
            <span className="text-white/80 font-light">Convert</span> <span className="bg-white px-4 py-2 text-[#0A0E17] rounded-lg inline-block">Complexity</span>
            <br /> 
            <span className="text-white/80 font-light">To Visual Brilliance</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mb-12 font-light animate-fadeIn opacity-0 animation-delay-300">
            VizKidd transforms your complex text into beautiful, 
            intuitive visualizations that clarify concepts and ideas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fadeIn opacity-0 animation-delay-500">
            <button 
              onClick={handleVisualizeClick}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#0A0E17] font-semibold rounded-full hover:bg-white/90 transition-all duration-300"
            >
              <Play className="h-5 w-5" />
              {user ? 'Visualize Now' : 'Get Started'}
            </button>
          </div>
          
          {/* Scroll indicator */}
          <div 
            className="absolute bottom-10 animate-bounce cursor-pointer"
            onClick={scrollToSecondSection}
          >
            <ArrowDown className="h-8 w-8 text-white/50" />
          </div>
        </section>
      </div>

      {/* Second Section - Features */}
      <div ref={secondSectionRef} className="min-h-screen relative">
        <section className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 py-32">
          <div className="opacity-0 transform translate-y-10 transition duration-1000" 
               style={{ 
                 opacity: scrollY > 300 ? 1 : 0, 
                 transform: scrollY > 300 ? 'translateY(0)' : 'translateY(10px)' 
               }}>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-24">
              VizKidd Offers<br />
              <span className="text-gray-400 font-normal">Visual Intelligence</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Concept Mapping Card */}
            <div 
              className="bg-[#151B29] border border-[#2A3247] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.03] hover:border-blue-400/30 opacity-0 transform translate-y-10 group flex flex-col h-[500px]"
              style={{ 
                opacity: scrollY > 400 ? 1 : 0, 
                transform: scrollY > 400 ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: '100ms' 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-6 relative z-10 flex flex-col flex-grow">
                <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-700 -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-5"></div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-300 transition-colors duration-300">Concept Mapping</h3>
                <p className="text-gray-400 mb-8 group-hover:text-gray-300 transition-colors duration-300">
                  Intelligent extraction of key technical concepts, visualized through adaptive formats—from flowcharts to neural networks —tailored to your content's complexity.
                </p>
                
                <div className="rounded-xl border border-[#2A3247] overflow-hidden group-hover:border-blue-400/20 transition-all duration-300 mt-auto">
                  <div className="bg-[#0D1320] p-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-400 text-xs ml-2">Visualization</span>
                  </div>
                  <div className="bg-[#0A0E17] p-4 relative overflow-hidden">
                    <div className="text-white text-sm">Conceptualizing Data...</div>
                    <div className="mt-4 text-gray-300 text-sm">
                      <div className="text-blue-300 mb-2">Network graph generated:</div>
                      <div className="h-24 bg-[#101624] rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="relative h-full w-full">
                          <div className="absolute h-3 w-3 bg-blue-400 rounded-full top-1/4 left-1/4 animate-pulse"></div>
                          <div className="absolute h-2 w-2 bg-purple-400 rounded-full top-1/2 left-1/3 animate-pulse" style={{animationDelay: '300ms'}}></div>
                          <div className="absolute h-4 w-4 bg-indigo-400 rounded-full bottom-1/4 right-1/4 animate-pulse" style={{animationDelay: '600ms'}}></div>
                          <div className="absolute h-2 w-2 bg-cyan-400 rounded-full top-1/3 right-1/3 animate-pulse" style={{animationDelay: '900ms'}}></div>
                          <div className="absolute top-1/4 left-1/4 h-0.5 w-16 bg-blue-400/30 rotate-12 transform origin-left"></div>
                          <div className="absolute top-1/3 right-1/3 h-0.5 w-12 bg-cyan-400/30 -rotate-45 transform origin-right"></div>
                          <div className="absolute bottom-1/4 right-1/4 h-0.5 w-14 bg-indigo-400/30 rotate-45 transform origin-right"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Analysis Card */}
            <div 
              className="bg-[#151B29] border border-[#2A3247] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.03] hover:border-emerald-400/30 opacity-0 transform translate-y-10 group flex flex-col h-[500px]"
              style={{ 
                opacity: scrollY > 400 ? 1 : 0, 
                transform: scrollY > 400 ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: '300ms' 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-6 relative z-10 flex flex-col flex-grow">
                <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700 -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-5"></div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-emerald-300 transition-colors duration-300">Intricate Visualizations</h3>
                <p className="text-gray-400 mb-8 group-hover:text-gray-300 transition-colors duration-300">
                Watch as our advanced AI transforms technical jargon into clear, beautiful visualizations in seconds.
                </p>
                
                <div className="rounded-xl border border-[#2A3247] overflow-hidden group-hover:border-emerald-400/20 transition-all duration-300 mt-auto">
                  <div className="bg-[#0D1320] p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-emerald-400 text-sm">Processing...</span>
                    </div>
                    <div className="bg-[#0A0E17] p-4 rounded-lg font-mono text-xs relative overflow-hidden">
                      <div className="text-emerald-300">AI model initializing...</div>
                      <div className="text-gray-400 mt-2">Extracting semantic context</div>
                      <div className="h-12 mt-2 overflow-hidden relative">
                        <div className="absolute left-0 w-full whitespace-nowrap animate-marquee">
                          <span className="text-emerald-300 mr-2">|</span>
                          <span className="text-blue-300 mr-2">analyzing text structure</span>
                          <span className="text-emerald-300 mr-2">|</span>
                          <span className="text-purple-300 mr-2">identifying key entities</span>
                          <span className="text-emerald-300 mr-2">|</span>
                          <span className="text-cyan-300 mr-2">mapping relationships</span>
                          <span className="text-emerald-300 mr-2">|</span>
                          <span className="text-yellow-300 mr-2">generating visual schema</span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full animate-progress"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interactive Exploration Card */}
            <div 
              className="bg-[#151B29] border border-[#2A3247] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.03] hover:border-purple-400/30 opacity-0 transform translate-y-10 group flex flex-col h-[500px]"
              style={{ 
                opacity: scrollY > 400 ? 1 : 0, 
                transform: scrollY > 400 ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: '500ms' 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-6 relative z-10 flex flex-col flex-grow">
                <div className="absolute top-0 right-0 h-20 w-20 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-700 -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-5"></div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-purple-300 transition-colors duration-300">AI Assistant</h3>
                <p className="text-gray-400 mb-8 group-hover:text-gray-300 transition-colors duration-300">
                  Engage with our intelligent assistant that guides you through your visualizations, answers questions, and helps uncover deeper insights in your data.
                </p>
                
                <div className="rounded-xl border border-[#2A3247] overflow-hidden group-hover:border-purple-400/20 transition-all duration-300 mt-auto">
                  <div className="bg-[#0D1320] p-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-400 text-xs ml-2">Assistant</span>
                  </div>
                  <div className="bg-[#0A0E17] p-4 relative overflow-hidden">
                    <div className="text-white text-sm flex items-center">
                      <span className="text-purple-300 mr-2">AI Assistant:</span> 
                      <span className="text-white/70 text-xs">Ready to help</span>
                    </div>
                    <div className="mt-4 relative">
                      <div className="h-24 bg-[#101624] rounded-lg p-3 overflow-hidden">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                          </div>
                          <div>
                            <div className="text-xs text-white/80">How can I help analyze your visualization?</div>
                            <div className="mt-2 text-xs text-gray-400">Try asking about key concepts or relationships...</div>
                            <div className="mt-3 flex items-center">
                              <div className="h-1 w-1 bg-purple-400 rounded-full animate-pulse"></div>
                              <div className="h-1 w-1 bg-purple-400 rounded-full animate-pulse ml-1" style={{animationDelay: '300ms'}}></div>
                              <div className="h-1 w-1 bg-purple-400 rounded-full animate-pulse ml-1" style={{animationDelay: '600ms'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className="flex justify-center mt-16 opacity-0 transform translate-y-10 transition duration-1000"
            style={{ 
              opacity: scrollY > 500 ? 1 : 0, 
              transform: scrollY > 500 ? 'translateY(0)' : 'translateY(10px)' 
            }}
          >
            <div className="flex items-center gap-4">
              <button 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSlide === 0 ? 'bg-gray-400 scale-110' : 'bg-gray-600 hover:bg-gray-500'}`}
                onClick={() => setActiveSlide(0)}
                aria-label="Go to slide 1"
              ></button>
              <button 
                className={`w-6 h-3 rounded-full transition-all duration-300 ${activeSlide === 1 ? 'bg-blue-500 scale-110' : 'bg-gray-600 hover:bg-gray-500'}`}
                onClick={() => setActiveSlide(1)}
                aria-label="Go to slide 2"
              ></button>
              <button 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSlide === 2 ? 'bg-gray-400 scale-110' : 'bg-gray-600 hover:bg-gray-500'}`}
                onClick={() => setActiveSlide(2)}
                aria-label="Go to slide 3"
              ></button>
            </div>
          </div>
        </section>
      </div>

      {/* New Content Section - Text and Diagrams */}
      <div ref={resultsSectionRef} className="min-h-screen relative">
        <section className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div 
            className="opacity-0 transform translate-y-10 transition duration-1000" 
            style={{ 
              opacity: scrollY > 650 ? 1 : 0, 
              transform: scrollY > 650 ? 'translateY(0)' : 'translateY(10px)' 
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-24">
              Visual Intelligence in Action
            </h2>
          </div>
          
          {/* First Row - Text 1 and Diagram 1 */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-16 md:mb-24 opacity-0 transform translate-y-10 transition duration-1000"
            style={{ 
              opacity: scrollY > 700 ? 1 : 0, 
              transform: scrollY > 700 ? 'translateY(0)' : 'translateY(10px)' 
            }}
          >
            {/* Text 1 */}
            <div className="p-4 md:p-6 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-blue-300">ResNet50</h3>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                ResNet50 is a 50-layer deep convolutional neural network introduced by Microsoft Research in 2015 to address the vanishing gradient problem through residual skip connections. It employs a bottleneck architecture where each residual block contains 1×1, 3×3, and 1×1 convolutional layers to enable efficient training of very deep models. Pre-trained on ImageNet, ResNet50 achieves state-of-the-art performance in image classification and is widely used as a backbone for object detection, segmentation, and transfer learning
              </p>
            </div>
            
            {/* Diagram 1 */}
            <div className="p-4 md:p-6 flex items-center justify-center">
              <img 
                src={text1Image} 
                alt="ResNet50 Architecture" 
                className="w-full max-w-[2000px] h-auto rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          
          {/* Second Row - Diagram 2 and Text 2 */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-16 md:mb-24 opacity-0 transform translate-y-10 transition duration-1000"
            style={{ 
              opacity: scrollY > 800 ? 1 : 0, 
              transform: scrollY > 800 ? 'translateY(0)' : 'translateY(10px)' 
            }}
          >
            {/* Diagram 2 */}
            <div className="p-4 md:p-6 flex items-center justify-center order-2 md:order-1">
              <img 
                src={text2Image} 
                alt="Linux OS Architecture" 
                className="w-full max-w-[1000px] h-auto rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            {/* Text 2 */}
            <div className="p-4 md:p-6 flex flex-col justify-center order-1 md:order-2">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-emerald-300">Linux OS Architecture</h3>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                Linux OS follows a modular, layered structure: at the bottom is the hardware layer (CPU, memory, I/O devices), which interfaces with the monolithic kernel-the system's core responsible for process scheduling, memory management, device drivers, and filesystem operations. Above the kernel lie the shell and system libraries/utilities, providing command interpreters and APIs for user-space programs. At the top sit user applications, from desktop environments to server daemons, all leveraging these underlying services to perform their tasks.
              </p>
            </div>
          </div>
          
          {/* Third Row - Text 3 and Diagram 3 */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-16 md:mb-24 opacity-0 transform translate-y-10 transition duration-1000"
            style={{ 
              opacity: scrollY > 900 ? 1 : 0, 
              transform: scrollY > 900 ? 'translateY(0)' : 'translateY(10px)' 
            }}
          >
            {/* Text 3 */}
            <div className="p-4 md:p-6 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-purple-300">LRU Cache</h3>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                An LRU (Least Recently Used) cache is a fixed-size store that evicts the least recently accessed item when capacity is reached. It combines a doubly linked list-keeping the most recently used entries at the head and the least at the tail-with a hash map for O(1) lookups and updates. On each access or insertion, the item is moved to the front of the list, ensuring that frequently used data remains cached while stale entries are removed efficiently
              </p>
            </div>
            
            {/* Diagram 3 */}
            <div className="p-4 md:p-6 flex items-center justify-center">
              <img 
                src={text3Image} 
                alt="LRU Cache Implementation" 
                className="w-full max-w-[1000px] h-auto rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const animationStyles = `
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

@keyframes slow-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slow-spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes progress {
  0% { width: 5%; }
  50% { width: 70%; }
  75% { width: 85%; }
  100% { width: 100%; }
}

@keyframes slideIn {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

.animate-marquee {
  animation: marquee 15s linear infinite;
}

.animate-slow-spin {
  animation: slow-spin 20s linear infinite;
}

.animate-slow-spin-reverse {
  animation: slow-spin-reverse 15s linear infinite;
}

.animate-blink {
  animation: blink 1.5s ease-in-out infinite;
}

.animate-progress {
  animation: progress 3s ease-in-out infinite alternate;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out forwards;
}
`;

export default LandingPage; 