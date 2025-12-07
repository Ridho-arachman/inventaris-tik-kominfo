import { Prisma, StatusAset } from "@/generated/client";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { hardwareSchema } from "@/schema/hardwareSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user) {
      return handleResponse({
        success: false,
        message: "User Belum Login",
        status: 403,
      });
    }

    const body = await req.json();

    const bodyHardware = {
      ...body,
      tglPengadaan: body.tglPengadaan && new Date(body.tglPengadaan),
      garansiMulai: body.garansiMulai && new Date(body.garansiMulai),
      garansiSelesai: body.garansiSelesai && new Date(body.garansiSelesai),
    };

    const parsed = hardwareSchema.safeParse(bodyHardware);

    if (!parsed.success) return handleZodValidation(parsed);

    const dataHardware = parsed.data;

    const hardware = await prisma.hardware.create({
      data: {
        ...dataHardware,
        createdBy: user.user.id,
        updatedBy: user.user.id,
      },
    });

    return handleResponse({
      success: true,
      message: "Hardware Berhasil Dibuat",
      data: hardware,
      status: 201,
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

    // Internal Server Error
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
    if (!user)
      return handleResponse({
        success: false,
        message: "User belum login",
        status: 403,
      });

    const searchParams = req.nextUrl.searchParams;
    const nama = searchParams.get("nama") || "";
    const merk = searchParams.get("merk") || "";
    const kategori = searchParams.get("kategori") || "";
    const status = searchParams.get("status") || "";
    const tahun = searchParams.get("tahun") || "";
    const opdId = searchParams.get("opdId") || "";
    const pic = searchParams.get("pic") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: Prisma.HardwareWhereInput = { deletedAt: null };

    if (nama) where.nama = { contains: nama, mode: "insensitive" };
    if (opdId) where.opdId = opdId === "ALL" ? {} : { contains: opdId };
    if (merk) where.merk = { contains: merk, mode: "insensitive" };
    if (status) where.status = status.toUpperCase() as StatusAset;
    if (pic) where.pic = { contains: pic, mode: "insensitive" };
    if (tahun) {
      const start = new Date(`${tahun}-01-01`);
      const end = new Date(`${tahun}-12-31T23:59:59.999Z`);
      where.tglPengadaan = { gte: start, lte: end };
    }
    if (kategori)
      where.kategoriHardware =
        kategori === "ALL"
          ? {}
          : {
              is: { id: { equals: kategori } },
            };

    const totalItems = await prisma.hardware.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    const hardware = await prisma.hardware.findMany({
      where,
      include: { kategoriHardware: true, opd: { select: { nama: true } } },
      orderBy: { tglPengadaan: "desc" },
      skip,
      take: limit,
    });

    const total = hardware.length;
    const totalAktif = hardware.filter((h) => h.status === "AKTIF").length;
    const totalNonAktif = hardware.filter(
      (h) => h.status === "NON_AKTIF"
    ).length;

    return handleResponse({
      success: true,
      message: "Data hardware berhasil diambil",
      data: {
        summary: { total, aktif: totalAktif, nonAktif: totalNonAktif },
        pagination: { page, limit, totalItems, totalPages },
        hardware,
      },
      status: 200,
    });
  } catch (error) {
    const prismaError = handlePrismaError(error);
    if (prismaError)
      return handleResponse({
        success: false,
        message: prismaError.message,
        status: prismaError.status,
      });

    return handleResponse({
      success: false,
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};

// export const GET = async (req: NextRequest) => {
//   try {
//     const user = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!user) {
//       return handleResponse({
//         success: false,
//         message: "User Belum Login",
//         status: 403,
//       });
//     }

//     const searchParams = req.nextUrl.searchParams;
//     const q = searchParams.get("q") || "";

//     const parsedQ = hardwareQuerySchema.safeParse({ nama: q });

//     if (!parsedQ.success) return handleZodValidation(parsedQ);

//     const query = parsedQ.data.nama;

//     const kategoriHardware = await prisma.kategoriHardware.findMany({
//       where: query ? { nama: { contains: query, mode: "insensitive" } } : {},
//     });

//     if (kategoriHardware.length === 0) {
//       return handleResponse({
//         success: false,
//         message: "Data Kategori Hardware Tidak Ditemukan",
//         status: 404,
//       });
//     }

//     return handleResponse({
//       success: true,
//       message: "Data Kategori Hardware Berhasil Ditemukan",
//       data: kategoriHardware,
//       status: 200,
//     });
//   } catch (error) {
//     // Prisma Error Handler
//     const prismaResponse = handlePrismaError(error);
//     if (prismaResponse) {
//       return handleResponse({
//         success: false,
//         message: prismaResponse.message,
//         status: prismaResponse.status,
//       });
//     }

//     // Internal Server Error
//     return handleResponse({
//       success: false,
//       message: "Terjadi kesalahan pada server",
//       status: 500,
//     });
//   }
// };
