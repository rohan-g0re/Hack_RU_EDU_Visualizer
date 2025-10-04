import React, { useEffect, useRef } from 'react';
import { VisualizationResult } from '../../types/concept.types';

interface ConceptVisualizerProps {
  concept?: VisualizationResult;
  className?: string;
}

const ConceptVisualizer: React.FC<ConceptVisualizerProps> = ({
  concept,
  className = '',
}) => {
  const svgRef = useRef<HTMLDivElement>(null);

  // Apply dark theme styling to any SVG loaded into the component
  useEffect(() => {
    if (svgRef.current && concept?.svg) {
      // Give a small delay for the SVG to be fully rendered
      const timer = setTimeout(() => {
        const svgElement = svgRef.current?.querySelector('svg');
        if (svgElement) {
          // Set SVG background to transparent
          svgElement.style.background = 'transparent';
          
          // Apply light text color to all text elements
          const textElements = svgElement.querySelectorAll('text');
          textElements.forEach(text => {
            // Only change color if not already set or if it's black/dark
            const currentFill = text.getAttribute('fill');
            if (!currentFill || currentFill === '#000' || currentFill === '#000000' || currentFill === 'black') {
              text.setAttribute('fill', '#E5E7EB'); // Light gray color
            }
          });

          // Apply styling to paths and other elements if they're black
          const pathElements = svgElement.querySelectorAll('path, rect, circle, line, polyline, polygon');
          pathElements.forEach(element => {
            const currentStroke = element.getAttribute('stroke');
            if (currentStroke === '#000' || currentStroke === '#000000' || currentStroke === 'black') {
              element.setAttribute('stroke', '#E5E7EB');
            }
            
            const currentFill = element.getAttribute('fill');
            if (currentFill === '#000' || currentFill === '#000000' || currentFill === 'black') {
              element.setAttribute('fill', '#E5E7EB');
            }
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [concept?.svg]);
  
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div 
        ref={svgRef}
        dangerouslySetInnerHTML={{ __html: concept?.svg || '<svg width="100%" height="100%" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="#0A192F" rx="8" ry="8" /><text x="400" y="300" text-anchor="middle" fill="#E5E7EB" font-family="system-ui, sans-serif" font-size="24">No visualization available</text></svg>' }} 
        className="w-full h-full flex items-center justify-center overflow-auto"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default ConceptVisualizer; 