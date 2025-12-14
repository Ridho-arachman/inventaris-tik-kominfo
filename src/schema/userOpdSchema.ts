import z from "zod";

export const userQuerySchema = z.object({
  q: z.string("Query harus berupa string").trim().optional(),
});

export const userQuerySchemaById = z.object({
  id: z.string("Query harus berupa string").trim(),
});

export const userUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Nama wajib diisi")
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),

  email: z
    .string()
    .trim()
    .nonempty("Email wajib diisi")
    .email("Format email tidak valid"),

  idOpd: z.string("Id OPD Wajib Di Isi").trim().cuid("Id Opd Tidak Valid"),
});

export const userCreateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("Nama wajib diisi")
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter"),

    email: z
      .string()
      .trim()
      .nonempty("Email wajib diisi")
      .email("Format email tidak valid"),

    password: z
      .string()
      .trim()
      .nonempty("Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka")
      .regex(/[^a-zA-Z0-9]/, "Password harus mengandung simbol"),

    idOpd: z.string("Id OPD Wajib Di Isi").trim().cuid("Id Opd Tidak Valid"),

    confirmPassword: z.string().trim().nonempty("Confirm Password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama",
  });
