import { Role } from "@/generated/enums";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const allowedRoles: Role[] = ["OPD"];

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

  const opdId = session.user.idOpd as string;

  try {
    const searchParams = req.nextUrl.searchParams;
    const year = searchParams.get("year");

    // =========================
    // YEAR FILTER - MAX 10 YEARS
    // =========================
    const currentYear = new Date().getFullYear();
    const tenYearsAgo = currentYear - 10;

    let dateFilter;
    if (year && year !== "all") {
      const yearNum = Number(year);
      if (yearNum >= tenYearsAgo && yearNum <= currentYear) {
        dateFilter = {
          gte: new Date(`${yearNum}-01-01`),
          lte: new Date(`${yearNum}-12-31`),
        };
      } else {
        // fallback ke 10 tahun terakhir
        dateFilter = {
          gte: new Date(`${tenYearsAgo}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        };
      }
    } else {
      // year = all atau null
      dateFilter = {
        gte: new Date(`${tenYearsAgo}-01-01`),
        lte: new Date(`${currentYear}-12-31`),
      };
    }

    // =========================
    // PRISMA TRANSACTION
    // =========================
    const [hardware, software, hardwareStatus, softwareStatus] =
      await prisma.$transaction([
        prisma.hardware.findMany({
          where: {
            opdId,
            deletedAt: null,
            tglPengadaan: dateFilter,
          },
          select: {
            status: true,
            tglPengadaan: true,
            kategoriHardware: { select: { nama: true } },
          },
        }),

        prisma.software.findMany({
          where: {
            opdId,
            deletedAt: null,
            tglPengadaan: dateFilter,
          },
          select: {
            status: true,
            tglPengadaan: true,
            kategoriSoftware: { select: { nama: true } },
          },
        }),

        prisma.hardware.groupBy({
          by: ["status"],
          where: {
            opdId,
            deletedAt: null,
            tglPengadaan: dateFilter,
          },
          _count: { _all: true },
          orderBy: { status: "asc" },
        }),

        prisma.software.groupBy({
          by: ["status"],
          where: {
            opdId,
            deletedAt: null,
            tglPengadaan: dateFilter,
          },
          _count: { _all: true },
          orderBy: { status: "asc" },
        }),
      ]);

    // =========================
    // SUMMARY STATUS
    // =========================
    const summary = {
      total: hardware.length + software.length,
      aktif: 0,
      nonAktif: 0,
    };

    [...hardwareStatus, ...softwareStatus].forEach((item) => {
      const count = typeof item._count === "object" ? item._count._all ?? 0 : 0;
      if (item.status === "AKTIF") summary.aktif += count;
      if (item.status === "NON_AKTIF") summary.nonAktif += count;
    });

    // =========================
    // KATEGORI BAR CHART
    // =========================
    const kategoriMap: Record<string, number> = {};
    hardware.forEach((h) => {
      const nama = h.kategoriHardware.nama;
      kategoriMap[nama] = (kategoriMap[nama] || 0) + 1;
    });
    software.forEach((s) => {
      const nama = s.kategoriSoftware.nama;
      kategoriMap[nama] = (kategoriMap[nama] || 0) + 1;
    });
    const kategori = Object.entries(kategoriMap).map(([category, total]) => ({
      category,
      total,
    }));

    // =========================
    // LINE CHART PER TAHUN
    // =========================
    const yearMap: Record<number, number> = {};
    [...hardware, ...software].forEach((item) => {
      const y = item.tglPengadaan.getFullYear();
      yearMap[y] = (yearMap[y] || 0) + 1;
    });
    const perTahun = Object.entries(yearMap)
      .map(([year, total]) => ({ year: Number(year), total }))
      .sort((a, b) => a.year - b.year);

    // =========================
    // RESPONSE
    // =========================
    return handleResponse({
      success: true,
      message: "Data berhasil diambil",
      data: {
        meta: { opdId, year: year ?? "all" },
        summary,
        charts: {
          status: [
            { name: "Aktif", value: summary.aktif },
            { name: "Non Aktif", value: summary.nonAktif },
          ],
          kategori,
          perTahun,
        },
      },
      status: 200,
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
