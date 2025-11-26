// handleZodValidation.ts
import { ZodTypeAny } from "zod";
import { handleResponse } from "./handleResponse";
import { extractErrors } from "./extractErrors";

export const handleZodValidation = <T extends ZodTypeAny>(
  parsed: ReturnType<T["safeParse"]>
) => {
  return handleResponse({
    success: false,
    message: "Validasi gagal",
    errors: extractErrors(parsed),
    status: 400,
  });
};
