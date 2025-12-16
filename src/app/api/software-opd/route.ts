import {
  JenisLisensi,
  KritikalitasStatus,
  Prisma,
  StatusAset,
} from "@/generated/client";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { softwareCreateSchema } from "@/schema/softwareSchema";

import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await auth.api.getSession({ headers: await headers() });

    if (!user) {
      return handleResponse({
        success: false,
        message: "User belum login",
        status: 403,
      });
    }

    const body = await req.json();

    const payload = {
      ...body,
      tglPengadaan: body.tglPengadaan && new Date(body.tglPengadaan),
      tglBerakhirLisensi:
        body.tglBerakhirLisensi && new Date(body.tglBerakhirLisensi),
    };

    const parsed = softwareCreateSchema.safeParse(payload);
    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;

    const res = await prisma.software.create({
      data: {
        ...data,
        nomorSeri: data.nomorSeri === undefined ? undefined : data.nomorSeri,
        createdBy: user.user.id,
        updatedBy: user.user.id,
      },
    });

    return handleResponse({
      success: true,
      message: "Data software berhasil ditambahkan",
      data: res,
      status: 201,
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

export const GET = async (req: NextRequest) => {
  try {
    const user = await auth.api.getSession({ headers: await headers() });

    if (!user) {
      return handleResponse({
        success: false,
        message: "User belum login",
        status: 403,
      });
    }

    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const jenisLisensi = searchParams.get("jenisLisensi") || "";
    const kritikalitas = searchParams.get("kritikalitas") || "";
    const kategori = searchParams.get("kategori") || "";
    const opdId = searchParams.get("opdId") || "";
    const status = searchParams.get("status") || "";
    const tahun = searchParams.get("tahun") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: Prisma.SoftwareWhereInput = {
      deletedAt: null,
      opdId: user.user.idOpd as string,
    };

    if (q) {
      where.OR = [
        { nama: { contains: q, mode: "insensitive" } },
        { nomorSeri: { contains: q, mode: "insensitive" } },
        { hardware: { nomorSeri: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (opdId) where.opdId = opdId === "ALL" ? {} : { contains: opdId };
    if (kritikalitas)
      where.kritikalitas =
        kritikalitas === "ALL"
          ? {}
          : (kritikalitas.toUpperCase() as KritikalitasStatus);
    if (jenisLisensi)
      where.jenisLisensi =
        jenisLisensi === "ALL"
          ? {}
          : (jenisLisensi.toUpperCase() as JenisLisensi);
    if (status)
      where.status =
        status === "ALL" ? {} : (status.toUpperCase() as StatusAset);
    if (tahun) {
      const start = new Date(`${tahun}-01-01`);
      const end = new Date(`${tahun}-12-31T23:59:59.999Z`);
      where.tglPengadaan = tahun === "ALL" ? {} : { gte: start, lte: end };
    }
    if (kategori)
      where.kategoriSoftware =
        kategori === "ALL"
          ? {}
          : {
              is: { id: { equals: kategori } },
            };

    const totalItems = await prisma.software.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    const software = await prisma.software.findMany({
      where,
      include: {
        hardware: true,
        kategoriSoftware: true,
        opd: { select: { nama: true } },
      },
      orderBy: { tglPengadaan: "desc" },
      skip,
      take: limit,
    });

    const total = software.length;
    const totalAktif = software.filter((h) => h.status === "AKTIF").length;
    const totalNonAktif = software.filter(
      (h) => h.status === "NON_AKTIF"
    ).length;

    return handleResponse({
      success: true,
      message: "Data software berhasil diambil",
      data: {
        summary: { total, aktif: totalAktif, nonAktif: totalNonAktif },
        pagination: { page, limit, totalItems, totalPages },
        software,
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
