-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_codeOpd_fkey";

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_codeOpd_fkey" FOREIGN KEY ("codeOpd") REFERENCES "Opd"("id") ON DELETE SET NULL ON UPDATE CASCADE;
