import z from "zod";

export const OpdCreateSchema = z.object({
  kode: z
    .string()
    .trim()
    .nonempty("Code wajib diisi")
    .max(50, "Code maksimal 20 karakter"),

  nama: z
    .string()
    .trim()
    .nonempty("Name wajib diisi")
    .max(255, "Name maksimal 255 karakter"),
});

export const opdQuerySchema = z.object({
  q: z.string("Query harus berupa string").trim().uppercase().optional(),
});

export const idOpdSchema = z.object({
  id: z.string().trim().cuid("id wajib diisi"),
});
