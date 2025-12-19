import { Role } from "@/generated/enums";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const GET = async (req: Request) => {
  const allowedRoles: Role[] = ["ADMIN"];
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return handleResponse({
      success: false,
      message: "User belum login",
      status: 403,
    });
  }

  if (!allowedRoles.includes(session.user.role as Role)) {
    return handleResponse({
      success: false,
      message: "Akses ditolak",
      status: 403,
    });
  }

  try {
    const url = new URL(req.url);
    const yearParam = url.searchParams.get("year");

    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const startTenYears = currentYear - 9;

    /* ======================
       MODE & YEAR VALIDATION
    ====================== */
    const parsedYear = yearParam ? Number(yearParam) : null;
    const isYearMode =
      parsedYear &&
      !Number.isNaN(parsedYear) &&
      parsedYear >= 1970 &&
      parsedYear <= currentYear;

    /* ======================
       DATE FILTER
    ====================== */
    const dateFilter = isYearMode
      ? {
          gte: new Date(Date.UTC(parsedYear!, 0, 1)),
          lt: new Date(Date.UTC(parsedYear! + 1, 0, 1)),
        }
      : {
          gte: new Date(Date.UTC(startTenYears, 0, 1)),
          lt: new Date(Date.UTC(currentYear + 1, 0, 1)),
        };

    /* ======================
       1. SUMMARY
    ====================== */
    const [
      totalOpd,
      totalUsers,
      totalHardware,
      totalSoftware,
      aktifHardware,
      nonAktifHardware,
      aktifSoftware,
      nonAktifSoftware,
    ] = await prisma.$transaction([
      prisma.opd.count(),
      prisma.user.count({ where: { role: "OPD" } }),

      prisma.hardware.count({
        where: { deletedAt: null, tglPengadaan: dateFilter },
      }),
      prisma.software.count({
        where: { deletedAt: null, tglPengadaan: dateFilter },
      }),

      prisma.hardware.count({
        where: {
          status: "AKTIF",
          deletedAt: null,
          tglPengadaan: dateFilter,
        },
      }),
      prisma.hardware.count({
        where: {
          status: "NON_AKTIF",
          deletedAt: null,
          tglPengadaan: dateFilter,
        },
      }),

      prisma.software.count({
        where: {
          status: "AKTIF",
          deletedAt: null,
          tglPengadaan: dateFilter,
        },
      }),
      prisma.software.count({
        where: {
          status: "NON_AKTIF",
          deletedAt: null,
          tglPengadaan: dateFilter,
        },
      }),
    ]);

    /* ======================
       2. RAW DATA
    ====================== */
    const [hardwareList, softwareList] = await prisma.$transaction([
      prisma.hardware.findMany({
        where: { deletedAt: null, tglPengadaan: dateFilter },
        select: { opdId: true, status: true, tglPengadaan: true },
      }),
      prisma.software.findMany({
        where: { deletedAt: null, tglPengadaan: dateFilter },
        select: { opdId: true, status: true, tglPengadaan: true },
      }),
    ]);

    /* ======================
       3. ASSET GROWTH
    ====================== */
    let assetGrowth: { label: string; total: number }[] = [];

    if (isYearMode) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];

      assetGrowth = months.map((label, month) => {
        const total =
          hardwareList.filter(
            (h) =>
              h.tglPengadaan?.getUTCFullYear() === parsedYear &&
              h.tglPengadaan?.getUTCMonth() === month
          ).length +
          softwareList.filter(
            (s) =>
              s.tglPengadaan?.getUTCFullYear() === parsedYear &&
              s.tglPengadaan?.getUTCMonth() === month
          ).length;

        return { label, total };
      });
    } else {
      assetGrowth = Array.from({ length: 10 }, (_, i) => {
        const year = startTenYears + i;

        const total =
          hardwareList.filter((h) => h.tglPengadaan?.getUTCFullYear() === year)
            .length +
          softwareList.filter((s) => s.tglPengadaan?.getUTCFullYear() === year)
            .length;

        return { label: String(year), total };
      });
    }

    /* ======================
       4. ASSET PER OPD
    ====================== */
    const opdList = await prisma.opd.findMany({
      select: { id: true, nama: true },
    });

    const assetsPerOpd = opdList.map((opd) => {
      const hw = hardwareList.filter((h) => h.opdId === opd.id);
      const sw = softwareList.filter((s) => s.opdId === opd.id);

      return {
        id: opd.id,
        name: opd.nama,
        totalAssets: hw.length + sw.length,
        hardware: {
          total: hw.length,
          aktif: hw.filter((h) => h.status === "AKTIF").length,
          nonAktif: hw.filter((h) => h.status === "NON_AKTIF").length,
        },
        software: {
          total: sw.length,
          aktif: sw.filter((s) => s.status === "AKTIF").length,
          nonAktif: sw.filter((s) => s.status === "NON_AKTIF").length,
        },
      };
    });

    /* ======================
       RESPONSE
    ====================== */
    return handleResponse({
      success: true,
      message: "Data berhasil diambil",
      status: 200,
      data: {
        mode: isYearMode ? "YEAR" : "ALL",
        range: isYearMode ? parsedYear : `${startTenYears}-${currentYear}`,

        summary: {
          totalOpd,
          totalUsers,
          totalHardware,
          totalSoftware,
        },

        assetHardwareStatus: [
          { name: "Aktif", count: aktifHardware },
          { name: "Non Aktif", count: nonAktifHardware },
        ],

        assetSoftwareStatus: [
          { name: "Aktif", count: aktifSoftware },
          { name: "Non Aktif", count: nonAktifSoftware },
        ],

        assetGrowth,
        assetsPerOpd,
      },
    });
  } catch (error) {
    const prismaErr = handlePrismaError(error);
    if (prismaErr) {
      return handleResponse({
        success: false,
        message: prismaErr.message,
        status: prismaErr.status,
      });
    }

    return handleResponse({
      success: false,
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};
