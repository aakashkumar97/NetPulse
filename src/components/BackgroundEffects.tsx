'use client';

import React from 'react';

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[120px] animate-float [animation-delay:-5s]" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-background" />
      
      {/* Sweep Animation Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent h-[100%] w-full animate-sweep" />
    </div>
  );
}