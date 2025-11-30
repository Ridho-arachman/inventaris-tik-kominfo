/*
  Warnings:

  - The `jenisLisensi` column on the `Software` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `JenisHardware` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JenisLisensi" AS ENUM ('PERPETUAL', 'LANGGANAN', 'OPEN_SOURCE');

-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_jenisId_fkey";

-- AlterTable
ALTER TABLE "Software" DROP COLUMN "jenisLisensi",
ADD COLUMN     "jenisLisensi" "JenisLisensi" NOT NULL DEFAULT 'OPEN_SOURCE';

-- DropTable
DROP TABLE "JenisHardware";

-- DropEnum
DROP TYPE "jenisLisensi";

-- CreateTable
CREATE TABLE "KategoriHardware" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KategoriHardware_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KategoriHardware_nama_key" ON "KategoriHardware"("nama");

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_jenisId_fkey" FOREIGN KEY ("jenisId") REFERENCES "KategoriHardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
