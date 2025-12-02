/*
  Warnings:

  - You are about to drop the column `code` on the `Opd` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Opd` table. All the data in the column will be lost.
  - You are about to drop the column `codeOpd` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kode]` on the table `Opd` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama]` on the table `Opd` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kode` to the `Opd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `Opd` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_codeOpd_fkey";

-- DropIndex
DROP INDEX "Opd_code_key";

-- DropIndex
DROP INDEX "Opd_name_key";

-- AlterTable
ALTER TABLE "Opd" DROP COLUMN "code",
DROP COLUMN "name",
ADD COLUMN     "kode" VARCHAR(50) NOT NULL,
ADD COLUMN     "nama" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "codeOpd",
ADD COLUMN     "idOpd" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "Opd_kode_key" ON "Opd"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Opd_nama_key" ON "Opd"("nama");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_idOpd_fkey" FOREIGN KEY ("idOpd") REFERENCES "Opd"("id") ON DELETE SET NULL ON UPDATE CASCADE;
