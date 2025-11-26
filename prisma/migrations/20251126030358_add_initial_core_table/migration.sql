-- CreateEnum
CREATE TYPE "StatusAset" AS ENUM ('AKTIF', 'NON_AKTIF', 'CADANGAN');

-- CreateEnum
CREATE TYPE "jenisLisensi" AS ENUM ('PERPETUAL', 'LANGGANAN', 'OPEN_SOURCE');

-- CreateEnum
CREATE TYPE "KritikalitasStatus" AS ENUM ('TINGGI', 'SEDANG', 'RENDAH');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "codeOpd" TEXT;

-- CreateTable
CREATE TABLE "Opd" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisHardware" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisHardware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hardware" (
    "kodeId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "merk" TEXT NOT NULL,
    "spesifikasi" TEXT NOT NULL,
    "lokasiFisik" TEXT NOT NULL,
    "tglPengadaan" TIMESTAMP(3) NOT NULL,
    "garansiMulai" TIMESTAMP(3) NOT NULL,
    "garansiSelesai" TIMESTAMP(3) NOT NULL,
    "status" "StatusAset" NOT NULL DEFAULT 'AKTIF',
    "pic" TEXT NOT NULL,
    "biayaProlehan" DECIMAL(65,30) NOT NULL,
    "nomorSeri" TEXT NOT NULL,
    "penyedia" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "opdId" TEXT NOT NULL,
    "jenisId" TEXT NOT NULL,

    CONSTRAINT "Hardware_pkey" PRIMARY KEY ("kodeId")
);

-- CreateTable
CREATE TABLE "KategoriSoftware" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KategoriSoftware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisLisensi" "jenisLisensi" NOT NULL DEFAULT 'OPEN_SOURCE',
    "serialNumber" TEXT NOT NULL,
    "tglBerakhirLisensi" TIMESTAMP(3) NOT NULL,
    "versiTerpasang" INTEGER NOT NULL,
    "vendor" TEXT,
    "inHouse" BOOLEAN NOT NULL DEFAULT false,
    "kritikalitas" "KritikalitasStatus" NOT NULL,
    "hargaPerolehan" DECIMAL(65,30) NOT NULL,
    "tahunPengadaan" TIMESTAMP(3) NOT NULL,
    "status" "StatusAset" NOT NULL DEFAULT 'AKTIF',
    "pic" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "opdId" TEXT NOT NULL,
    "kategoriId" TEXT NOT NULL,
    "hardwareTerinstall" TEXT NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Opd_code_key" ON "Opd"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Opd_name_key" ON "Opd"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JenisHardware_nama_key" ON "JenisHardware"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriSoftware_nama_key" ON "KategoriSoftware"("nama");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_codeOpd_fkey" FOREIGN KEY ("codeOpd") REFERENCES "Opd"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hardware" ADD CONSTRAINT "Hardware_jenisId_fkey" FOREIGN KEY ("jenisId") REFERENCES "JenisHardware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_opdId_fkey" FOREIGN KEY ("opdId") REFERENCES "Opd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriSoftware"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Software" ADD CONSTRAINT "Software_hardwareTerinstall_fkey" FOREIGN KEY ("hardwareTerinstall") REFERENCES "Hardware"("kodeId") ON DELETE RESTRICT ON UPDATE CASCADE;
