/*
  Warnings:

  - You are about to alter the column `biayaPerolehan` on the `Hardware` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(18,2)`.
  - You are about to drop the column `serialNumber` on the `Software` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nomorSeri]` on the table `Hardware` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomorSeri` to the `Software` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SumberPengadaan" AS ENUM ('PEMBELIAN', 'HIBAH', 'TRANSFER_OPD', 'PROYEK_PAKET');

-- AlterTable
ALTER TABLE "Hardware" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" VARCHAR(100),
ADD COLUMN     "sumber" "SumberPengadaan" NOT NULL DEFAULT 'PEMBELIAN',
ALTER COLUMN "biayaPerolehan" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Software" DROP COLUMN "serialNumber",
ADD COLUMN     "nomorSeri" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hardware_nomorSeri_key" ON "Hardware"("nomorSeri");

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
