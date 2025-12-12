import {
  JenisLisensi,
  KritikalitasStatus,
  StatusAset,
} from "@/generated/enums";
import { z } from "zod";

export const softwareBaseSchema = z
  .object({
    nama: z.string().trim().min(1, "Nama software wajib diisi"),
    jenisLisensi: z.enum(JenisLisensi),
    nomorSeri: z
      .string()
      .max(50, " Nomor seri maksimal 50 karakter")
      .nullable()
      .optional(),

    tglBerakhirLisensi: z
      .date("Tanggal berakhir lisensi tidak valid")
      .nullable()
      .optional(),

    versiTerpasang: z
      .string()
      .trim()
      .min(1, "Versi terpasang wajib diisi")
      .max(100, "Versi terpasang maksimal 100 karakter"),

    vendor: z.string().nullable().optional(),
    inHouse: z.boolean(),
    kritikalitas: z.enum(KritikalitasStatus, "Kritikalitas tidak valid"),
    hargaPerolehan: z
      .string("Biaya perolehan harus berupa string")
      .regex(/^[0-9.]+$/, "Biaya perolehan harus berupa angka"),

    tglPengadaan: z.date("Tahun pengadaan tidak valid"),

    status: z.enum(StatusAset),
    pic: z.string().trim().min(1, "PIC wajib diisi"),

    opdId: z.string().min(1, "OPD wajib dipilih"),
    kategoriId: z.string().min(1, "Kategori wajib dipilih"),
    hardwareTerinstall: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      !data.tglBerakhirLisensi || data.tglBerakhirLisensi >= data.tglPengadaan,
    {
      message:
        "Tanggal berakhir lisensi harus lebih besar atau sama dengan tanggal pengadaan",
      path: ["tglBerakhirLisensi"],
    }
  )
  .refine(
    (data) =>
      data.jenisLisensi === JenisLisensi.OPEN_SOURCE ||
      (!!data.nomorSeri && data.nomorSeri.trim() !== ""),
    {
      message: "Nomor seri wajib diisi untuk lisensi selain Open Source",
      path: ["nomorSeri"],
    }
  );

export const softwareCreateSchema = softwareBaseSchema;

export const softwareUpdateSchema = softwareBaseSchema
  .partial()
  .required({
    opdId: true, // ✅ pastikan tidak bisa ganti OPD
  })
  .refine((data) => !(data.hargaPerolehan === ""), {
    message: "Harga perolehan tidak boleh kosong",
    path: ["hargaPerolehan"],
  });

// export const softwareQuerySchema = z.object({
//   nama: z.string().optional(),
//   jenisLisensi: jenisLisensiSchema.optional(),
//   kritikalitas: kritikalitasSchema.optional(),
//   status: statusAsetSchema.optional(),
//   pic: z.string().optional(),
//   opdId: z.string().optional(), // "ALL" atau id OPD
//   kategoriId: z.string().optional(), // "ALL" atau id kategori
//   tahun: z.coerce.number().int().optional(), // filter by year
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(100).default(10),
// });
