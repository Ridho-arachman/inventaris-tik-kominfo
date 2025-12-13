import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const GET = async () => {
  try {
    // Auth check
    const user = await auth.api.getSession({ headers: await headers() });
    if (!user) {
      return handleResponse({
        success: false,
        message: "User belum login",
        status: 403,
      });
    }

    // Summary counts
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
      prisma.hardware.count({ where: { deletedAt: null } }),
      prisma.software.count({ where: { deletedAt: null } }),
      prisma.hardware.count({ where: { status: "AKTIF", deletedAt: null } }),
      prisma.hardware.count({
        where: { status: "NON_AKTIF", deletedAt: null },
      }),
      prisma.software.count({ where: { status: "AKTIF", deletedAt: null } }),
      prisma.software.count({
        where: { status: "NON_AKTIF", deletedAt: null },
      }),
    ]);

    // Asset growth 12 bulan terakhir
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: d.toLocaleString("id-ID", { month: "short" }),
      };
    }).reverse();

    const [hardwareCounts, softwareCounts] = await prisma.$transaction([
      prisma.hardware.groupBy({
        by: ["createdAt"],
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 11, 1),
          },
        },
        _count: { _all: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.software.groupBy({
        by: ["createdAt"],
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 11, 1),
          },
        },
        _count: { _all: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const assetGrowth = months.map((m) => {
      const hwTotal = hardwareCounts
        .filter(
          (h) =>
            h.createdAt.getMonth() + 1 === m.month &&
            h.createdAt.getFullYear() === m.year
        )
        .reduce(
          (acc, h) => acc + ((h._count as { _all: number })._all || 0),
          0
        );

      const swTotal = softwareCounts
        .filter(
          (s) =>
            s.createdAt.getMonth() + 1 === m.month &&
            s.createdAt.getFullYear() === m.year
        )
        .reduce(
          (acc, s) => acc + ((s._count as { _all: number })._all || 0),
          0
        );

      return { label: m.label, total: hwTotal + swTotal };
    });

    // Assets per OPD
    const opds = await prisma.opd.findMany({
      select: {
        id: true,
        nama: true,
        hardware: { where: { deletedAt: null }, select: { status: true } },
        software: { where: { deletedAt: null }, select: { status: true } },
      },
    });

    const assetsPerOpd = opds.map((opd) => {
      const hwAktif = opd.hardware.filter((h) => h.status === "AKTIF").length;
      const hwNonAktif = opd.hardware.filter(
        (h) => h.status === "NON_AKTIF"
      ).length;
      const swAktif = opd.software.filter((s) => s.status === "AKTIF").length;
      const swNonAktif = opd.software.filter(
        (s) => s.status === "NON_AKTIF"
      ).length;

      return {
        id: opd.id,
        name: opd.nama,
        totalAssets: opd.hardware.length + opd.software.length,
        aktif: hwAktif + swAktif,
        nonAktif: hwNonAktif + swNonAktif,
        // tambahkan properti hardware & software supaya front-end bisa pakai
        hardware: {
          total: opd.hardware.length,
          aktif: hwAktif,
          nonAktif: hwNonAktif,
        },
        software: {
          total: opd.software.length,
          aktif: swAktif,
          nonAktif: swNonAktif,
        },
      };
    });

    // Final response
    const data = {
      summary: { totalOpd, totalUsers, totalHardware, totalSoftware },
      assetHardwareStatus: [
        { name: "Aktif", aktifHardware },
        { name: "Non Aktif", nonAktifHardware },
      ],
      assetSoftwareStatus: [
        { name: "Aktif", aktifSoftware },
        { name: "Non Aktif", nonAktifSoftware },
      ],
      assetsPerOpd,
      assetGrowth,
    };

    return handleResponse({
      success: true,
      message: "Data berhasil diambil",
      data,
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
