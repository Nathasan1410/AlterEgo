import type { GeneratedOption } from "../models/generated";

export class JSONParser {
  static parseGeneratedContent(
    content: string,
    expectedType: "array" | "object"
  ): GeneratedOption[] {
    const strategies = [
      () => JSONParser.parseDirect(content),
      () => JSONParser.parseArray(content),
      () => JSONParser.parseObject(content),
      () => JSONParser.parseUppercaseKeys(content),
    ];

    for (const strategy of strategies) {
      try {
        const result = strategy();
        if (result) {
          return JSONParser.validateAndTransform(result, expectedType);
        }
      } catch {
        continue;
      }
    }

    return JSONParser.getFallback(expectedType);
  }

  private static parseDirect(content: string): any {
    const clean = content.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  }

  private static parseArray(content: string): any {
    const match = content.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : null;
  }

  private static parseObject(content: string): any {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      const obj = JSON.parse(match[0]);
      const normalized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        normalized[key.toLowerCase()] = value;
      }
      return normalized;
    }
    return null;
  }

  private static parseUppercaseKeys(content: string): any {
    try {
      const obj = JSON.parse(content);
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
        result[normalizedKey] = value;
      }
      return result;
    } catch {
      return null;
    }
  }

  private static validateAndTransform(
    result: any,
    expectedType: "array" | "object"
  ): GeneratedOption[] {
    if (Array.isArray(result)) {
      return result.map((p: any) => {
        let content = p.content || p.text || p.topic || p.hook || p.cta || String(p);

        if (String(content).length < 5 && !isNaN(Number(content))) {
          content = "Content generation failed (invalid format). Please try again.";
        }

        return {
          content,
          score: p.score || 75,
          reasoning: p.reasoning || "AI generated",
          metadata: p.metadata,
        };
      });
    }

    if (typeof result === "object" && result !== null) {
      return Object.values(result).map((p: any) => {
        let content = p.content || p.text || p.topic || p.hook || p.cta || String(p);

        if (String(content).length < 5 && !isNaN(Number(content))) {
          content = "Content generation failed (invalid format). Please try again.";
        }

        return {
          content,
          score: p.score || 75,
          reasoning: p.reasoning || "AI generated",
          metadata: p.metadata,
        };
      });
    }

    throw new Error("Invalid parse result");
  }

  private static getFallback(expectedType: "array" | "object"): GeneratedOption[] {
    return [
      {
        content: "Generation error. Please try again.",
        score: 0,
        reasoning: "Parse failed",
      },
    ];
  }
}
