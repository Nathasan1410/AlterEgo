/**
 * Opik Adapter - Implementation of IObservabilityAdapter
 */

import { Opik } from 'opik';
import { IObservabilityAdapter, ITrace, ISpan } from './interfaces';

export class OpikAdapter implements IObservabilityAdapter {
  readonly projectName: string;
  private client: Opik;

  constructor(apiKey: string, projectName: string) {
    this.projectName = projectName;
    this.client = new Opik({
      apiKey,
      projectName
    });
  }

  trace(name: string, input: any, options?: { tags?: string[]; metadata?: any }): ITrace {
    const traceInstance = this.client.trace({
      name,
      input,
      tags: options?.tags,
      metadata: options?.metadata
    });

    return {
      id: 'trace-id-placeholder', // SDK doesn't always expose ID synchronously
      span: (spanName: string, type: string = 'general', spanInput?: any): ISpan => {
        const spanInstance = traceInstance.span({
          name: spanName,
          type: type as any,
          input: spanInput
        });
        
        return {
          id: 'span-id-placeholder',
          end: () => spanInstance.end()
        };
      },
      end: () => traceInstance.end()
    };
  }

  logEvaluation(input: any, output: any, evaluations: any[], traceId?: string): void {
    // Opik SDK might have specific evaluation logging methods
    // For now, we can log it as a separate trace or metric if SDK supports it
    // Or just console log for hackathon demo if SDK integration is complex
    // But ideally: this.client.reportMetric(...)
    
    // For this adapter, we will assume standard tracing covers inputs/outputs
    // We can add a specialized trace for evaluation
    this.client.trace({
      name: 'Evaluation',
      input: { original_input: input, output },
      output: evaluations,
      tags: ['evaluation']
    });
  }

  async flush(): Promise<void> {
    await this.client.flush();
  }
}
