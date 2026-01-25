// lib/opik-client.ts
// Opik SDK Client for AI Observability & Tracing
// Simplified wrapper for hackathon demo

import { Opik } from 'opik';

// Singleton instance
let opikInstance: Opik | null = null;

export const getOpikClient = (): Opik => {
  if (!opikInstance) {
    if (!process.env.OPIK_API_KEY) {
      console.warn('OPIK_API_KEY not set - using Opik with defaults');
    }
    
    opikInstance = new Opik({
      apiKey: process.env.OPIK_API_KEY,
      projectName: 'commit-to-career'
    });
  }
  return opikInstance;
};

// Flush all pending traces
export const flushOpik = async () => {
  if (opikInstance) {
    await opikInstance.flush();
  }
};
