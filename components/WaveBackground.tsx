'use client';

import React from 'react';

export default function WaveBackground() {
  return (
    <div className="wave-container">
        {/* Wave 1 (Bottom) */}
        <div className="wave wave-1"></div>

         {/* Wave 2 (Offset) */}
        <div className="wave wave-2"></div>
        
         {/* Wave 3 (Offset) */}
        <div className="wave wave-3"></div>
    </div>
  );
}
