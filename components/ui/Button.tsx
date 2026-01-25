'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'magic';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  onClick,
  type = 'button',
  style,
  className = ''
}: ButtonProps) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    borderRadius: '0.75rem', // Rounded-xl for modern feel
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // REFINED "DEEP FOCUS" VARIANTS
  const variants = {
    primary: {
      // Solid Orange-600 with subtle 3D pop
      background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.2), 0 2px 4px -1px rgba(234, 88, 12, 0.1)',
    },
    secondary: {
      // Neutral Stone-100 (No more orange distraction)
      background: '#f5f5f4', // Stone-100
      color: '#1c1917',      // Stone-900
      border: '1px solid #e7e5e4', // Stone-200
    },
    ghost: {
      background: 'transparent',
      color: '#57534e',      // Stone-600
    },
    outline: {
      background: 'transparent',
      color: '#1c1917',
      border: '1px solid #d6d3d1', // Stone-300
    },
    danger: {
      background: '#f43f5e', // Rose-500 (Softer than Red)
      color: '#fff',
    },
    magic: {
      // Violet for AI/Magic actions
      background: '#8b5cf6', 
      color: '#fff',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  // Dynamic hover styles based on variant
  const getHoverStyle = () => {
    if (disabled || loading) return {};
    if (variant === 'primary') return { scale: 1.02, filter: 'brightness(1.1)' };
    if (variant === 'secondary') return { background: '#e7e5e4' }; // Stone-200
    if (variant === 'ghost') return { background: 'rgba(249, 115, 22, 0.1)', color: '#ea580c' }; // Orange tint
    if (variant === 'magic') return { scale: 1.05, filter: 'brightness(1.1)' };
    return { scale: 1.02 };
  };

  return (
    <motion.button
      type={type}
      className={className}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
      whileHover={getHoverStyle()}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
          }}
        />
      )}
      {icon && !loading && icon}
      {children}
    </motion.button>
  );
}
