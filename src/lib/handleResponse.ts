import { NextResponse } from "next/server";

interface ResponseProps<T = unknown, E = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: E;
  status?: number;
}

export function handleResponse<T = unknown, E = unknown>({
  success,
  message = "Success",
  data,
  errors,
  status = 200,
}: ResponseProps<T, E>) {
  // Body bertipe generic
  const body: { success: boolean; message: string; data?: T; errors?: E } = {
    success,
    message,
  };
  if (data !== undefined) body.data = data;
  if (errors !== undefined) body.errors = errors;

  return NextResponse.json(body, { status });
}
