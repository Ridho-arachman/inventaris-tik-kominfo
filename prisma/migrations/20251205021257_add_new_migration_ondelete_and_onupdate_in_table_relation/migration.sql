/*
  Warnings:

  - The values [CADANGAN] on the enum `StatusAset` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `jenisId` on the `Hardware` table. All the data in the column will be lost.
  - Added the required column `kategoriId` to the `Hardware` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `Hardware` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Software` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusAset_new" AS ENUM ('AKTIF', 'NON_AKTIF');
ALTER TABLE "public"."Hardware" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Software" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Hardware" ALTER COLUMN "status" TYPE "StatusAset_new" USING ("status"::text::"StatusAset_new");
ALTER TABLE "Software" ALTER COLUMN "status" TYPE "StatusAset_new" USING ("status"::text::"StatusAset_new");
ALTER TYPE "StatusAset" RENAME TO "StatusAset_old";
ALTER TYPE "StatusAset_new" RENAME TO "StatusAset";
DROP TYPE "public"."StatusAset_old";
ALTER TABLE "Hardware" ALTER COLUMN "status" SET DEFAULT 'AKTIF';
ALTER TABLE "Software" ALTER COLUMN "status" SET DEFAULT 'AKTIF';
COMMIT;

-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_jenisId_fkey";

-- DropForeignKey
ALTER TABLE "Hardware" DROP CONSTRAINT "Hardware_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_hardwareTerinstall_fkey";

-- DropForeignKey
ALTER TABLE "Software" DROP CONSTRAINT "Software_updatedBy_fkey";

-- DropIndex
DROP INDEX "Hardware_jenisId_idx";

-- AlterTable
ALTER TABLE "Hardware" DROP COLUMN "jenisId",
ADD COLUMN     "kategoriId" VARCHAR(100) NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Software" ALTER COLUMN "createdBy" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Hardware_kategoriId_idx" ON "Hardware"("kategoriId");

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriHardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_hardwareTerinstall_fkey" FOREIGN KEY ("hardwareTerinstall") REFERENCES "Hardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
