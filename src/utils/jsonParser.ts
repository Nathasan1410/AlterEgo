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
    // Check if result looks like an array but isn't detected as one
    if (typeof result === "object" && result !== null && !Array.isArray(result)) {
      const keys = Object.keys(result);
      
      // If object has a single key and the value is an array, use that array
      if (keys.length === 1) {
        const firstKey = keys[0];
        const firstValue = result[firstKey];
        if (Array.isArray(firstValue)) {
          result = firstValue;
        }
      }
      
      // If it has numeric keys like "0", "1", etc., it might be an array-like object
      if (!Array.isArray(result)) {
        const numericKeys = keys.filter(k => !isNaN(Number(k)));
        if (numericKeys.length === keys.length && numericKeys.length > 0) {
          result = Object.values(result);
        }
      }
    }
    
    // Special case: if result is an array with one item that has a content field containing JSON array
    if (Array.isArray(result) && result.length === 1) {
      const firstItem = result[0];
      if (firstItem && typeof firstItem === "object" && firstItem.content) {
        const contentStr = firstItem.content;
        // Check if content looks like a JSON array
        if (typeof contentStr === "string" && contentStr.trim().startsWith("[") && contentStr.trim().endsWith("]")) {
          try {
            const nestedArray = JSON.parse(contentStr);
            if (Array.isArray(nestedArray)) {
              // Process the nested array items directly and return
              return nestedArray.map((p: any) => ({
                content: p.content || "",
                score: p.score || 75,
                reasoning: p.reasoning || "AI generated",
                metadata: p.metadata,
              }));
            }
          } catch {
            // Failed to parse nested JSON, continue with normal processing
          }
        }
      }
    }
    
    if (Array.isArray(result)) {
      return result.map((p: any) => {
        let content = p.content || p.text || p.topic || p.hook || p.cta;

        // If no known property found, handle the raw value
        if (!content) {
          if (typeof p === "string") {
            content = p;
          } else if (typeof p === "object" && p !== null) {
            // Try to extract any string value from the object
            const stringValue = Object.values(p).find((v) => typeof v === "string");
            content = stringValue || JSON.stringify(p);
          } else {
            content = String(p);
          }
        }

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
        let content = p.content || p.text || p.topic || p.hook || p.cta;

        // If no known property found, handle the raw value
        if (!content) {
          if (typeof p === "string") {
            content = p;
          } else if (typeof p === "object" && p !== null) {
            // Try to extract any string value from the object
            const stringValue = Object.values(p).find((v) => typeof v === "string");
            content = stringValue || JSON.stringify(p);
          } else {
            content = String(p);
          }
        }

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
