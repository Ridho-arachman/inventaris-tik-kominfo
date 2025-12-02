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
ALTER TABLE "Hardware" ALTER COLUMN "createdBy" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "updatedBy" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "opdId" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "jenisId" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Software" ALTER COLUMN "createdBy" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "updatedBy" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "opdId" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "kategoriId" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "hardwareTerinstall" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "codeOpd" SET DATA TYPE VARCHAR(100);

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
