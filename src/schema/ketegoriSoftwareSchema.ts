import z from "zod";

export const kategoriSoftwareSchema = z.object({
  nama: z
    .string("Name harus berupa string")
    .trim()
    .min(1, "Name wajib diisi")
    .max(100, "Nama maksimal 100 karakter")
    .uppercase("Name harus huruf besar"),
});

export const kategoriSoftwareQuerySchema = z.object({
  q: z
    .string("Name harus berupa string")
    .trim()
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
});

export const kategoriSoftwareIdSchema = z.object({
  id: z.string().trim().cuid("Id Tidak Valid"),
});
