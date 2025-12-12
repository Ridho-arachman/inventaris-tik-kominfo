/*
  Warnings:

  - Made the column `updatedBy` on table `Hardware` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Hardware" ALTER COLUMN "updatedBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Software" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" VARCHAR(100),
ALTER COLUMN "kritikalitas" SET DEFAULT 'SEDANG';

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
