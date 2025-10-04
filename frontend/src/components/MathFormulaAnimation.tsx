import React, { useEffect, useState } from 'react';

// Mathematical and scientific formulas to display in the animation
const formulas = [
  "E = mc²",
  "F = ma",
  "a² + b² = c²",
  "∮ E·dl = -∂ΦB/∂t",
  "∇ × B = μ₀J + μ₀ε₀∂E/∂t",
  "PV = nRT",
  "eiπ + 1 = 0",
  "F = G(m₁m₂)/r²",
  "E = hf",
  "ΔS ≥ 0",
  "∫ f(x) dx",
  "ψ(x,t) = Ae^i(kx-ωt)",
  "ds² = -(c·dt)² + dx² + dy² + dz²",
  "d/dx[∫f(x)dx] = f(x)",
  "Σ(n=1 to ∞) 1/n² = π²/6",
  "∇·D = ρ",
  "∇ × E = -∂B/∂t",
  "H₂O",
  "CO₂",
  "NH₃",
  "C₆H₁₂O₆",
  "dx/dt = f(x,t)",
  "∂u/∂t = α·∂²u/∂x²",
  "Zn + 2HCl → ZnCl₂ + H₂",
  "(a+b)² = a² + 2ab + b²",
  "lim(x→∞) (1 + 1/x)^x = e"
];

// Colors for the formulas
const colors = [
  "rgb(56, 189, 248)", // Light blue
  "rgb(16, 185, 129)", // Emerald
  "rgb(224, 242, 254)", // Sky 100
  "rgb(125, 211, 252)", // Sky 300
  "rgb(14, 165, 233)", // Sky 500
  "rgb(167, 243, 208)", // Emerald 200
  "rgb(52, 211, 153)" // Emerald 400
];

// Generate concentric circles for radar display
const radarCircles = [20, 35, 50, 65];

interface FormulaItem {
  id: number;
  formula: string;
  radius: number; // Distance from center
  angle: number; // Angle in degrees
  size: number;
  opacity: number;
  rotation: number;
  visible: boolean;
  fadeOut: boolean;
  floatDelay: number;
  glowDelay: number;
  color: string;
  detectionEffect: boolean;
}

interface ScanTrail {
  id: number;
  angle: number;
  opacity: number;
}

const MathFormulaAnimation: React.FC = () => {
  const [formulaItems, setFormulaItems] = useState<FormulaItem[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [radarAngle, setRadarAngle] = useState(0);
  const [ping, setPing] = useState<{x: number, y: number, active: boolean}>({ x: 0, y: 0, active: false });
  const [scanTrails, setScanTrails] = useState<ScanTrail[]>([]);

  useEffect(() => {
    // Calculate positions in a radar pattern
    const initialItems = formulas.map((formula, index) => {
      // Distribute formulas in different radiuses from center
      const radiusIndex = Math.floor(Math.random() * radarCircles.length);
      const radius = radarCircles[radiusIndex] + (Math.random() * 10 - 5);
      // Distribute formulas in different angles
      const angle = (index * 360) / formulas.length + (Math.random() * 20 - 10);
      
      return {
        id: index,
        formula,
        radius,
        angle,
        size: Math.random() * 1.5 + 1,
        opacity: 0,
        rotation: Math.random() * 360,
        visible: false,
        fadeOut: false,
        floatDelay: Math.random() * 5,
        glowDelay: Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        detectionEffect: false
      };
    });
    
    setFormulaItems(initialItems);
    
    // Radar sweep animation
    const radarSpeed = 2300; // Time for a full 360° sweep in ms
    const sweepStart = Date.now();
    let trailCounter = 0;
    
    const radarInterval = setInterval(() => {
      const elapsed = Date.now() - sweepStart;
      const newAngle = (elapsed / radarSpeed) * 360;
      setRadarAngle(newAngle % 360);
      
      // Add scan trail every few degrees
      if (Math.floor(newAngle) % 5 === 0) {
        setScanTrails(prev => {
          // Remove old trails if we have too many
          const filtered = prev.filter(trail => trail.opacity > 0.05);
          return [...filtered, { 
            id: trailCounter++, 
            angle: newAngle % 360,
            opacity: 0.5
          }];
        });
      }
      
      // Fade out trails gradually
      setScanTrails(prev => prev.map(trail => ({
        ...trail,
        opacity: trail.opacity * 0.95
      })));
      
      // Make formulas visible when radar sweeps past them
      setFormulaItems(prev => {
        let pingTriggered = false;
        let pingPosition = { x: 0, y: 0 };
        
        const newItems = prev.map(item => {
          // Calculate if this item should be "detected" by the radar
          const angleDiff = Math.abs((newAngle % 360) - item.angle);
          const isDetected = angleDiff < 5 && !item.visible;
          
          if (isDetected) {
            // Get position for the ping effect
            const pos = getPosition(item.radius, item.angle);
            pingTriggered = true;
            pingPosition = { x: pos.x, y: pos.y };
            
            return { ...item, visible: true, opacity: 0.9, detectionEffect: true };
          }
          
          // Fade out detection effect after a short time
          if (item.detectionEffect) {
            return { ...item, detectionEffect: false };
          }
          
          return item;
        });
        
        // Trigger ping effect
        if (pingTriggered) {
          setPing({ x: pingPosition.x, y: pingPosition.y, active: true });
          setTimeout(() => setPing(prev => ({ ...prev, active: false })), 500);
        }
        
        return newItems;
      });
      
      // End the radar animation after 2.5 seconds
      if (elapsed >= 2500) {
        clearInterval(radarInterval);
        setAnimationComplete(true);
        
        // Fade out all radar visual elements
        setTimeout(() => {
          setScanTrails([]);
        }, 300);
        
        setFormulaItems(prev => 
          prev.map(item => ({ ...item, fadeOut: true, opacity: 0.15, detectionEffect: false }))
        );
      }
    }, 16); // ~60fps
    
    // Continue running animation in the background after radar sweep
    const backgroundInterval = setInterval(() => {
      if (animationComplete) {
        setFormulaItems(prev => 
          prev.map(item => {
            const newAngle = (item.angle + 0.2) % 360;
            const newRadius = item.radius + (Math.sin(Date.now() / 1000 + item.id) * 0.5);
            return {
              ...item,
              angle: newAngle,
              radius: newRadius,
              rotation: (item.rotation + Math.random() * 2 - 1) % 360
            };
          })
        );
      }
    }, 3000);
    
    return () => {
      clearInterval(radarInterval);
      clearInterval(backgroundInterval);
    };
  }, [animationComplete]);

  // Convert polar coordinates (radius, angle) to Cartesian (x, y)
  const getPosition = (radius: number, angle: number) => {
    const centerX = 50; // Center of the screen (%)
    const centerY = 50;
    const x = centerX + radius * Math.cos(angle * Math.PI / 180);
    const y = centerY + radius * Math.sin(angle * Math.PI / 180);
    return { x, y };
  };

  if (formulaItems.length === 0) return null;

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 ${animationComplete ? 'opacity-30' : 'opacity-100'} transition-opacity duration-1000`}>
      {/* Radar background elements - only visible during initial animation */}
      <div className={`absolute inset-0 bg-[#0A192F]/80 transition-opacity duration-500 ${animationComplete ? 'opacity-0' : 'opacity-100'}`} />
      
      {/* Radar center point */}
      {!animationComplete && (
        <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-emerald-400 -translate-x-1/2 -translate-y-1/2 z-10" 
          style={{ boxShadow: '0 0 10px 2px rgba(16, 185, 129, 0.8)' }}
        />
      )}
      
      {/* Radar concentric circles */}
      {!animationComplete && radarCircles.map((radius, index) => (
        <div 
          key={`circle-${index}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-800/50"
          style={{ 
            width: `${radius * 2}vw`, 
            height: `${radius * 2}vw`,
            opacity: 0.2 + (0.1 * (radarCircles.length - index))
          }}
        />
      ))}
      
      {/* Radar grid lines */}
      {!animationComplete && (
        <>
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-emerald-800/20" />
          <div className="absolute left-0 top-1/2 w-full h-[1px] bg-emerald-800/20" />
          <div className="absolute left-1/2 top-1/2 w-[1px] h-full -translate-x-1/2 -translate-y-1/2 bg-emerald-800/20" 
            style={{ transform: 'translate(-50%, -50%) rotate(45deg)', transformOrigin: 'center' }}
          />
          <div className="absolute left-1/2 top-1/2 w-[1px] h-full -translate-x-1/2 -translate-y-1/2 bg-emerald-800/20" 
            style={{ transform: 'translate(-50%, -50%) rotate(-45deg)', transformOrigin: 'center' }}
          />
        </>
      )}
      
      {/* Scan history trails */}
      {scanTrails.map(trail => (
        <div 
          key={`trail-${trail.id}`}
          className="absolute w-[70vw] h-[1px] origin-left"
          style={{
            left: '50%',
            top: '50%',
            transform: `rotate(${trail.angle}deg)`,
            backgroundColor: `rgba(16, 185, 129, ${trail.opacity})`,
            opacity: trail.opacity,
            transition: 'opacity 200ms linear'
          }}
        />
      ))}
      
      {/* Radar sweep line */}
      {!animationComplete && (
        <div 
          className="absolute w-[70vw] h-[1px] bg-emerald-400 origin-left z-10 opacity-70"
          style={{
            left: '50%',
            top: '50%',
            transform: `rotate(${radarAngle}deg)`,
            boxShadow: '0 0 8px 2px rgba(16, 185, 129, 0.6)',
            transition: 'transform 16ms linear'
          }}
        />
      )}
      
      {/* Detection ping effect */}
      {ping.active && !animationComplete && (
        <div 
          className="absolute w-8 h-8 rounded-full bg-emerald-400/50 radar-ping"
          style={{
            left: `${ping.x}%`,
            top: `${ping.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
      
      {/* Formula items */}
      {formulaItems.map(item => {
        const { x, y } = getPosition(item.radius, item.angle);
        return (
          <div
            key={item.id}
            className={`absolute transition-all font-mono font-bold formula-float formula-glow ${item.visible ? 'scale-100' : 'scale-0'} ${item.detectionEffect ? 'scale-110' : ''}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              opacity: item.opacity,
              fontSize: `${item.size}rem`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              color: item.color,
              '--float-delay': `${item.floatDelay}s`,
              '--glow-delay': `${item.glowDelay}s`,
              transition: item.detectionEffect ? 'all 0.2s ease-out' : 'all 0.7s ease-in-out'
            } as React.CSSProperties}
          >
            {item.formula}
          </div>
        );
      })}
    </div>
  );
};

export default MathFormulaAnimation; 