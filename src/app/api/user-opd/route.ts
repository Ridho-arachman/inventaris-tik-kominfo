import { Prisma } from "@/generated/client";
import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { userCreateSchema, userQuerySchema } from "@/schema/userOpdSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

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

    console.log(userRes);

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
  try {
    // Ambil body & validasi dengan Zod
    const body = await req.json();
    const parsed = userCreateSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const { name, email, password, idOpd } = parsed.data;

    const opdExists = await prisma.opd.findUnique({
      where: { id: idOpd },
    });

    if (!opdExists) {
      return handleResponse({
        success: false,
        message: "Id OPD tidak valid",
        status: 400,
      });
    }

    const newUser = await prisma.$transaction(async (tx) => {
      // 1️⃣ Buat user
      const user = await tx.user.create({
        data: {
          name,
          email,
          role: "OPD",
          idOpd,
        },
      });

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // 2️⃣ Buat account untuk user yang baru dibuat
      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credentials",
          accountId: user.email,
          password: hash, // bisa hash dulu sesuai kebutuhan
        },
      });

      return user;
    });

    // 3️⃣ Kembalikan response sukses
    return handleResponse({
      success: true,
      message: "Signup Berhasil",
      data: newUser,
    });
  } catch (error) {
    console.log(error);

    // Handle Prisma error
    const prismaErr = handlePrismaError(error);
    if (prismaErr) {
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
