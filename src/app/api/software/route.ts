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
    console.log(error);

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

// Filter dinamis
// if (nama) {
//   where.OR = [
//     { nama: { contains: nama, mode: "insensitive" } },
//     { nomorSeri: { contains: nama, mode: "insensitive" } },
//   ];
// }

// if (jenisLisensi) where.jenisLisensi = jenisLisensi;
// if (kritikalitas) where.kritikalitas = kritikalitas;
// if (status) where.status = status;
// if (pic) where.pic = { contains: pic, mode: "insensitive" };
// if (kategoriId && kategoriId !== "ALL") {
//   where.kategoriSoftware = { is: { id: kategoriId } };
// }
// // Catatan: opdId filter hanya untuk admin. OPD tidak perlu filter OPD lain.
// // Jika Anda hanya support OPD role, abaikan filterOpdId.

// if (tahun) {
//   const start = new Date(`${tahun}-01-01T00:00:00Z`);
//   const end = new Date(`${tahun}-12-31T23:59:59.999Z`);
//   where.tahunPengadaan = { gte: start, lte: end };
// }

// // ✅ 4. Query
// const [software, total] = await Promise.all([
//   prisma.software.findMany({
//     where,
//     include: {
//       opd: { select: { nama: true } },
//       kategoriSoftware: { select: { nama: true } },
//       hardware: { select: { nama: true } },
//     },
//     orderBy: { createdAt: "desc" },
//     skip,
//     take: limit,
//   }),
//   prisma.software.count({ where }),
// ]);

// const totalPages = Math.ceil(total / limit);
// const totalAktif = software.filter((s) => s.status === "AKTIF").length;
// const totalNonAktif = software.filter((s) => s.status === "NON_AKTIF").length;

// ✅ 5. Respons benar
