/*
  Warnings:

  - Added the required column `userId` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatarUrl" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
