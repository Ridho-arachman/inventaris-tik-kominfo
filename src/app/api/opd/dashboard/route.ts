import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Jika pakai auth BetterAuth
import { headers } from "next/headers";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";

export const GET = async () => {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    console.log(user);

    const opdId = user?.user.codeOpd;

    if (!opdId) {
      return handleResponse({
        success: false,
        message: "User tidak memiliki OPD",
        status: 403,
      });
    }

    // ---------------------------
    // HITUNG TOTAL HARDWARE
    // ---------------------------
    const totalHardware = await prisma.hardware.count({
      where: { opdId },
    });

    // ---------------------------
    // HITUNG TOTAL SOFTWARE
    // ---------------------------
    const totalSoftware = await prisma.software.count({
      where: { opdId },
    });

    // ---------------------------
    // HITUNG HARDWARE PER JENIS
    // Laptop / Router / Switch / Printer dll
    // ---------------------------
    const hardwareByJenis = await prisma.hardware.groupBy({
      by: ["jenisHardwareId"],
      where: { opdId },
      _count: {
        jenisHardwareId: true,
      },
    });

    // Ambil nama jenis hardware
    const jenisList = await prisma.jenisHardware.findMany({
      select: {
        id: true,
        nama: true,
      },
    });

    const hardwareJenis = hardwareByJenis.map((item) => {
      const jenis = jenisList.find((j) => j.id === item.jenisHardwareId);
      return {
        jenis: jenis?.nama || "Tidak diketahui",
        total: item._count.jenisHardwareId,
      };
    });

    // ---------------------------
    // HITUNG SOFTWARE PER KATEGORI
    // Antivirus / OS / Office / dll
    // ---------------------------
    const softwareByKategori = await prisma.software.groupBy({
      by: ["kategoriId"],
      where: { opdId },
      _count: {
        kategoriId: true,
      },
    });

    const kategoriList = await prisma.kategoriSoftware.findMany({
      select: {
        id: true,
        nama: true,
      },
    });

    const softwareKategori = softwareByKategori.map((item) => {
      const kategori = kategoriList.find((k) => k.id === item.kategoriId);
      return {
        kategori: kategori?.nama || "Tidak diketahui",
        total: item._count.kategoriId,
      };
    });

    // ---------------------------
    // RESPONSE FINAL
    // ---------------------------
    return handleResponse({
      success: true,
      message: "Statistik dashboard berhasil diambil",
      data: {
        opd: opdId,
        totalHardware,
        totalSoftware,
        totalAset: totalHardware + totalSoftware,
        hardwareJenis,
        softwareKategori,
      },
    });
  } catch (error) {
    // Prisma Error Handler
    const prismaResponse = handlePrismaError(error);
    if (prismaResponse) {
      return handleResponse({
        success: false,
        message: prismaResponse.message,
        status: prismaResponse.status,
      });
    }

    // Better Auth Handler
    const betterAuthErr = handleBetterAuthError(error);
    if (betterAuthErr) {
      return handleResponse({
        success: false,
        message: betterAuthErr.message,
        status: betterAuthErr.status,
      });
    }

    return handleResponse({
      success: false,
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};
