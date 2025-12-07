/*
  Warnings:

  - A unique constraint covering the columns `[idOpd]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Hardware` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Software` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hardware" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Software" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_idOpd_key" ON "user"("idOpd");
