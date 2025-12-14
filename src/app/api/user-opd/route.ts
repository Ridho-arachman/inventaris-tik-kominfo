import { Prisma } from "@/generated/client";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { userCreateSchema, userQuerySchema } from "@/schema/userOpdSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";

export const GET = async (req: NextRequest) => {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user)
      return handleResponse({
        success: false,
        message: "User Belum Login",
        status: 403,
      });

    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q") || "";

    const parsedQ = userQuerySchema.safeParse({ q });

    if (!parsedQ.success) return handleZodValidation(parsedQ);

    const query = parsedQ.data.q;

    const where: Prisma.UserWhereInput = query
      ? {
          role: "OPD",
          OR: [
            { email: { contains: query, mode: "insensitive" } },
            {
              opd: {
                OR: [
                  { kode: { contains: query, mode: "insensitive" } },
                  { nama: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          ],
        }
      : {
          role: "OPD",
        };

    const userRes = await prisma.user.findMany({
      where,
      include: {
        opd: {
          select: {
            nama: true,
            kode: true,
          },
        },
      },
    });

    if (userRes.length === 0) {
      return handleResponse({
        success: false,
        message: "Data User Opd Tidak Ditemukan",
        status: 404,
      });
    }

    return handleResponse({
      success: true,
      message: "Data User OPD Berhasil Ditemukan",
      data: userRes,
      status: 200,
    });
  } catch (error) {
    // PRISMA HANDLER ERROR
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

export const POST = async (req: NextRequest) => {
  let createdUserId: string | null = null;

  try {
    const body = await req.json();
    const parsed = userCreateSchema.safeParse(body);
    if (!parsed.success) return handleZodValidation(parsed);

    const { name, email, password, idOpd } = parsed.data;

    // 1️⃣ Signup auth
    const result = await auth.api.signUpEmail({
      headers: await headers(),
      body: { name, email, password },
    });

    if (!result?.user) {
      return handleResponse({
        success: false,
        message: "Gagal membuat user OPD",
        status: 400,
      });
    }

    createdUserId = result.user.id;

    // 2️⃣ Update Prisma
    await prisma.user.update({
      where: { id: createdUserId },
      data: { idOpd },
    });

    return handleResponse({
      success: true,
      message: "Signup Berhasil",
      data: result,
    });
  } catch (error) {
    // Better Auth Handler
    const betterAuthErr = handleBetterAuthError(error);
    if (betterAuthErr) {
      return handleResponse({
        success: false,
        message: betterAuthErr.message,
        status: betterAuthErr.status,
      });
    }

    // Handle Prisma error
    const prismaErr = handlePrismaError(error);
    if (prismaErr) {
      await prisma.user.delete({ where: { id: createdUserId as string } });
      return handleResponse({
        success: false,
        message: prismaErr.message,
        status: prismaErr.status,
      });
    }

    // Error internal server
    return handleResponse({
      success: false,
      message: "Terjadi error pada server",
      status: 500,
    });
  }
};
