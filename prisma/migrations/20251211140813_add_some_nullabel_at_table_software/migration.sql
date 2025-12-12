/*
  Warnings:

  - You are about to drop the column `tahunPengadaan` on the `Software` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nomorSeri]` on the table `Software` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tglPengadaan` to the `Software` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hardware" ALTER COLUMN "garansiMulai" DROP NOT NULL,
ALTER COLUMN "garansiSelesai" DROP NOT NULL,
ALTER COLUMN "biayaPerolehan" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Software" DROP COLUMN "tahunPengadaan",
ADD COLUMN     "tglPengadaan" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "tglBerakhirLisensi" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Software_nomorSeri_key" ON "Software"("nomorSeri");
