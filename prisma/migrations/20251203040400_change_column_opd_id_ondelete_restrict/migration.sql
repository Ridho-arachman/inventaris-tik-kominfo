-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_idOpd_fkey";

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_idOpd_fkey" FOREIGN KEY ("idOpd") REFERENCES "Opd"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
