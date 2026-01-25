'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  variant?: 'text' | 'paragraph' | 'card' | 'circle';
  width?: string;
  height?: string;
  count?: number;
  lines?: number;
  className?: string;
}

export default function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  lines = 3,
  className
}: SkeletonProps) {
  const baseStyles = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    borderRadius: '4px',
  };

  const variants = {
    text: {
      width: width,
      height: height || '20px',
    },
    paragraph: {
      width: width,
      height: height || '16px',
    },
    card: {
      width: width,
      height: height || '150px',
      borderRadius: '12px',
    },
    circle: {
      width: width || '50px',
      height: height || '50px',
      borderRadius: '50%',
    },
  };

  const renderSkeleton = () => (
    <motion.div
      className={className}
      style={{
        ...baseStyles,
        ...variants[variant],
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );

  if (variant === 'paragraph') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              ...baseStyles,
              width: i === lines - 1 ? '70%' : '100%',
              height: '16px',
            }}
            animate={{
              backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (count > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
}
