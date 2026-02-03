import { z, type ZodError } from "zod";

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data: T; error: string | null } {
  try {
    const validated = schema.parse(data);
    return {
      success: true,
      data: validated,
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        data: {} as T,
        error: firstError?.message || "Validation failed",
      };
    }
    return {
      success: false,
      data: {} as T,
      error: "Validation failed",
    };
  }
}

export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: boolean; data: T; error: string | null } {
  const data: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return validateRequest(schema, data);
}

export function formatZodError(error: ZodError): string {
  if (error.issues.length === 0) {
    return "Validation failed";
  }
  const firstError = error.issues[0];
  const path = firstError.path.join(".");
  if (path) {
    return `${path}: ${firstError.message}`;
  }
  return firstError.message;
}
