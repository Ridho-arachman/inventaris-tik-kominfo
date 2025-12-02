/*
  Warnings:

  - The primary key for the `Hardware` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `biayaProlehan` on the `Hardware` table. All the data in the column will be lost.
  - You are about to drop the column `kodeId` on the `Hardware` table. All the data in the column will be lost.
  - You are about to alter the column `nama` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `merk` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `lokasiFisik` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `pic` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nomorSeri` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `penyedia` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `createdBy` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `updatedBy` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `opdId` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `jenisId` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `nama` on the `KategoriHardware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nama` on the `KategoriSoftware` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `code` on the `Opd` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Opd` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nama` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `serialNumber` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `vendor` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `pic` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `createdBy` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `updatedBy` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `opdId` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `kategoriId` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `hardwareTerinstall` on the `Software` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `codeOpd` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `biayaPerolehan` to the `Hardware` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Hardware` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_jenisId_fkey";

-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_opdId_fkey";

-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_hardwareTerinstall_fkey";

-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_kategoriId_fkey";

-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_opdId_fkey";

-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_codeOpd_fkey";

-- AlterTable
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_pkey",
DROP COLUMN "biayaProlehan",
DROP COLUMN "kodeId",
ADD COLUMN     "biayaPerolehan" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "merk" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lokasiFisik" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "pic" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "nomorSeri" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "penyedia" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "createdBy" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "updatedBy" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "opdId" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "jenisId" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "Hardware_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "KategoriHardware" ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "KategoriSoftware" ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Opd" ALTER COLUMN "code" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Software" ALTER COLUMN "nama" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "serialNumber" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "vendor" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "pic" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "createdBy" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "updatedBy" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "opdId" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "kategoriId" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "hardwareTerinstall" DROP NOT NULL,
ALTER COLUMN "hardwareTerinstall" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "codeOpd" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE INDEX "Hardware_opdId_idx" ON "Hardware"("opdId");

-- CreateIndex
CREATE INDEX "Hardware_jenisId_idx" ON "Hardware"("jenisId");

-- CreateIndex
CREATE INDEX "Software_opdId_idx" ON "Software"("opdId");

-- CreateIndex
CREATE INDEX "Software_kategoriId_idx" ON "Software"("kategoriId");

-- CreateIndex
CREATE INDEX "Software_hardwareTerinstall_idx" ON "Software"("hardwareTerinstall");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_codeOpd_fkey" FOREIGN KEY ("codeOpd") REFERENCES "Opd"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_jenisId_fkey" FOREIGN KEY ("jenisId") REFERENCES "KategoriHardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriSoftware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_hardwareTerinstall_fkey" FOREIGN KEY ("hardwareTerinstall") REFERENCES "Hardware"("id") ON DELETE SET NULL ON UPDATE CASCADE;
