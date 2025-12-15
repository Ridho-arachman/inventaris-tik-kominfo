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
  rememberMe: z.boolean("Remember me harus berupa boolean").optional(),
});

export const signUpAdminSchema = z
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

    confirmPassword: z.string().trim().nonempty("Confirm Password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama",
  });

export const EmailSchema = z.object({
  email: z.string().email(),
});

export const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .trim()
      .nonempty("Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka")
      .regex(/[^a-zA-Z0-9]/, "Password harus mengandung simbol"),

    confirmPassword: z
      .string()
      .trim()
      .nonempty("Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka")
      .regex(/[^a-zA-Z0-9]/, "Password harus mengandung simbol"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama",
  });

export const userUpdateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Nama wajib diisi")
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
});

export const userUpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .nonempty("Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka")
      .regex(/[^a-zA-Z0-9]/, "Password harus mengandung simbol"),

    newPassword: z
      .string()
      .trim()
      .nonempty("Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka")
      .regex(/[^a-zA-Z0-9]/, "Password harus mengandung simbol"),

    confirmPassword: z
      .string()
      .trim()
      .nonempty("Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka")
      .regex(/[^a-zA-Z0-9]/, "Password harus mengandung simbol"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password baru anda tidak sama dengan confirm password",
  });

export const UserUpdateEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email wajib diisi")
    .email("Format email tidak valid"),
});
