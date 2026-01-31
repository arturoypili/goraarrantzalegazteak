
import React from 'react';

interface ShieldProps {
  className?: string;
}

const Shield: React.FC<ShieldProps> = ({ className = "w-32 h-32" }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg 
        viewBox="0 0 1000 1000" 
        className="w-full h-full overflow-visible" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Remos Cruzados */}
        <g id="remos-final" transform="translate(500, 560)">
          <g transform="rotate(25)">
            <path d="M-18 -340 L18 -340 L30 -110 L-30 -110 Z" fill="#A14E00" />
            <rect x="-7" y="-110" width="14" height="420" rx="4" fill="#A14E00" />
          </g>
          <g transform="rotate(-25)">
            <path d="M-18 -340 L18 -340 L30 -110 L-30 -110 Z" fill="#A14E00" />
            <rect x="-7" y="-110" width="14" height="420" rx="4" fill="#A14E00" />
          </g>
        </g>

        {/* Cuerda Blanca */}
        <path 
          d="M530 420 C580 420 600 540 500 640 C400 740 450 840 550 840" 
          fill="none" 
          stroke="#F3F4F6" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeOpacity="0.4"
        />

        {/* Ancla Roja */}
        <g id="ancla-final" transform="translate(500, 580)">
          <circle cx="0" cy="-200" r="50" fill="none" stroke="#E32619" strokeWidth="24" />
          <rect x="-20" y="-150" width="40" height="440" rx="4" fill="#E32619" />
          <path 
            d="M-150 200 C-150 330 150 330 150 200" 
            fill="none" 
            stroke="#E32619" 
            strokeWidth="50" 
            strokeLinecap="round" 
          />
          <path d="M-185 235 L-150 160 L-115 235 Z" fill="#E32619" />
          <path d="M115 235 L150 160 L185 235 Z" fill="#E32619" />
          <path d="M-45 350 L0 410 L45 350 Z" fill="#E32619" />
        </g>

        {/* Texto "GORA ARRANTZALE GAZTEAK" - Asegurando la 'G' inicial */}
        <defs>
          {/* Ruta de arco muy amplia y centrada para evitar recortes de letras iniciales/finales */}
          <path id="perfectShieldArc" d="M 100, 500 A 400,400 0 0,1 900,500" />
        </defs>
        <text 
          style={{ 
            fill: '#319B00', 
            fontSize: '72px', 
            fontWeight: '900',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'uppercase'
          }}
        >
          <textPath xlinkHref="#perfectShieldArc" startOffset="50%" textAnchor="middle">
            GORA ARRANTZALE GAZTEAK
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default Shield;
