'use client';

import { motion } from 'framer-motion';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels?: string[];
  gradient?: string;
  showValue?: boolean;
  label?: string;
}

export default function Slider({
  min,
  max,
  value,
  onChange,
  labels,
  gradient = 'linear-gradient(to right, #f97316, #ea580c)', // ORANGE THEME
  showValue = true,
  label
}: SliderProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--foreground)' }}>
          {label} {showValue && `: ${value}`}
        </label>
      )}
      
      <motion.input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        whileHover={{ scale: 1.01 }}
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: gradient,
          outline: 'none',
          cursor: 'pointer',
          WebkitAppearance: 'none',
        }}
      />
      
      {labels && labels.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '0.5rem', 
          fontSize: '0.85rem', 
          color: '#9ca3af' 
        }}>
          {labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
