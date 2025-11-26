// extractErrors.ts
import { ZodTypeAny } from "zod";

export function extractErrors<T extends ZodTypeAny>(
  parseResult: ReturnType<T["safeParse"]>
) {
  if (parseResult.success) return [];

  return parseResult.error.issues.map((issue) => ({
    field: issue.path?.join(".") || "",
    message: issue.message,
  }));
}
