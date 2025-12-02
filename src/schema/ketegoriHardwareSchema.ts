import z from "zod";

export const kategoriHardwareSchema = z.object({
  nama: z
    .string("Name harus berupa string")
    .trim()
    .min(1, "Name wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .uppercase("Name harus huruf besar"),
});

export const kategoriHardwareQuerySchema = z.object({
  q: z
    .string("Name harus berupa string")
    .trim()
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
});

export const kategoriHardwareIdSchema = z.object({
  id: z.string().trim().cuid("id wajib diisi"),
});
