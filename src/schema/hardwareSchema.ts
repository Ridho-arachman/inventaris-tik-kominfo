import { StatusAset, SumberPengadaan } from "@/generated/enums";
import z from "zod";

export const hardwareSchema = z.object({
  nama: z
    .string("Nama harus berupa string")
    .trim()
    .nonempty("Nama wajib diisi")
    .max(255, "Nama maksimal 255 karakter"),

  merk: z
    .string("Merk harus berupa string")
    .trim()
    .nonempty("Merk wajib diisi")
    .max(50, "Merk maksimal 50 karakter"),

  spesifikasi: z
    .string("Spesifikasi harus berupa string")
    .trim()
    .nonempty("Spesifikasi wajib diisi"),

  lokasiFisik: z
    .string("Lokasi fisik harus berupa string")
    .trim()
    .nonempty("Lokasi fisik wajib diisi")
    .max(255, "Lokasi fisik maksimal 255 karakter"),

  tglPengadaan: z.date("Tanggal pengadaan tidak valid"),

  garansiMulai: z.date("Tanggal mulai garansi tidak valid"),

  garansiSelesai: z.date("Tanggal selesai garansi tidak valid"),

  status: z.nativeEnum(StatusAset, "Status aset tidak valid"),

  pic: z
    .string("PIC harus berupa string")
    .trim()
    .nonempty("PIC wajib diisi")
    .max(255, "PIC maksimal 255 karakter"),

  biayaPerolehan: z
    .string("Biaya perolehan harus berupa string")
    .regex(/^[0-9.]+$/, "Biaya perolehan harus berupa angka"),

  nomorSeri: z
    .string("Nomor seri harus berupa string")
    .trim()
    .nonempty("Nomor seri wajib diisi")
    .max(100, "Nomor seri maksimal 100 karakter"),

  sumber: z.nativeEnum(SumberPengadaan, "Sumber pengadaan tidak valid"),

  penyedia: z
    .string("Penyedia harus berupa string")
    .trim()
    .max(255, "Penyedia maksimal 255 karakter")
    .nullable()
    .optional(),

  opdId: z
    .string("OPD ID harus berupa string")
    .trim()
    .nonempty("OPD ID wajib diisi")
    .max(100, "OPD ID maksimal 100 karakter"),

  kategoriId: z
    .string("Kategori hardware ID harus berupa string")
    .trim()
    .nonempty("Kategori hardware ID wajib diisi")
    .max(100, "Kategori hardware ID maksimal 100 karakter"),
});

export const hardwareIdSchema = z.object({
  id: z.string().trim().cuid("Id Tidak Valid"),
});
