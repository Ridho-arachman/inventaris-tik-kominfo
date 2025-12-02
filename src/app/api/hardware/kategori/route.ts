import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import {
  kategoriHardwareQuerySchema,
  kategoriHardwareSchema,
} from "@/schema/ketegoriHardwareSchema";
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

    const parsed = kategoriHardwareSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;

    const kategoriHardware = await prisma.kategoriHardware.create({ data });

    return handleResponse({
      success: true,
      message: "Kategori Hardware Berhasil Dibuat",
      data: kategoriHardware,
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

    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q") || "";

    const parsedQ = kategoriHardwareQuerySchema.safeParse({ q });

    if (!parsedQ.success) return handleZodValidation(parsedQ);

    const query = parsedQ.data.q;

    const kategoriHardware = await prisma.kategoriHardware.findMany({
      where: query ? { nama: { contains: query, mode: "insensitive" } } : {},
    });

    if (kategoriHardware.length === 0) {
      return handleResponse({
        success: false,
        message: "Data Kategori Hardware Tidak Ditemukan",
        status: 404,
      });
    }

    return handleResponse({
      success: true,
      message: "Data Kategori Hardware Berhasil Ditemukan",
      data: kategoriHardware,
      status: 200,
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
