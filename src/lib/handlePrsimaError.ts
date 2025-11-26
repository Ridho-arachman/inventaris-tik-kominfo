import { Prisma } from "@/generated/client";

interface PrismaErrorResponse {
  status: number;
  message: string;
}

export function handlePrismaError(error: unknown): PrismaErrorResponse | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // ===== CREATE (POST) =====
      case "P2002":
        return { status: 409, message: "Data sudah ada (unique constraint)" };
      case "P2003":
        return {
          status: 400,
          message: "Relasi foreign key tidak valid atau masih digunakan",
        };
      case "P2000":
        return { status: 400, message: "Nilai field terlalu panjang" };
      case "P2025":
        return {
          status: 404,
          message: "Parent ID tidak ditemukan (nested create)",
        };

      // ===== READ (GET) =====
      case "P2001":
        return {
          status: 404,
          message: "Record tidak ada / data tidak ditemukan",
        };
      case "P2018":
        return { status: 400, message: "Relasi wajib tidak lengkap" };
      case "P2025":
        return { status: 404, message: "Data tidak ditemukan" };

      // ===== UPDATE (PUT/PATCH) =====
      case "P2002":
        return {
          status: 409,
          message: "Duplikat data saat update (unique constraint)",
        };
      case "P2003":
        return {
          status: 400,
          message: "Relasi foreign key tidak valid saat update",
        };
      case "P2011":
        return {
          status: 400,
          message: "Field wajib tidak boleh null saat update",
        };
      case "P2025":
        return { status: 404, message: "Data tidak ditemukan untuk update" };

      // ===== DELETE (DELETE) =====
      case "P2003": // sama seperti di CREATE/UPDATE
        return { status: 400, message: "Data masih digunakan di tabel lain" };
      case "P2025":
        return {
          status: 404,
          message: "Data yang mau dihapus tidak ditemukan",
        };

      // ===== Prisma error umum lainnya =====
      case "P1000":
        return {
          status: 500,
          message: "Authentication failed (DB credentials salah)",
        };
      case "P1001":
        return {
          status: 500,
          message: "Database tidak dapat dijangkau / host salah",
        };
      case "P1002":
        return { status: 500, message: "Connection timeout / DB lambat" };
      case "P1017":
        return {
          status: 500,
          message: "Server menutup koneksi secara tak terduga",
        };
      case "P2004":
        return {
          status: 400,
          message: "Failed constraint check (custom constraint gagal)",
        };

      // Default fallback untuk kode Prisma lain
      default:
        return { status: 500, message: `Error Prisma (${error.code})` };
    }
  }

  // Bukan error Prisma
  return null;
}
