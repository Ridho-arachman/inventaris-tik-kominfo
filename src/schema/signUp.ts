import z from "zod";

export const signInSchema = z.object({
  email: z.string("Email wajib diisi").trim().email("Format email tidak valid"),
  password: z
    .string("Password wajib diisi")
    .trim()
    .min(8, "Password minimal 8 karakter")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[0-9]/, "Password harus mengandung angka")
    .regex(/[^a-zA-Z0-9]/, "Password harus mengandung simbol"),
});
