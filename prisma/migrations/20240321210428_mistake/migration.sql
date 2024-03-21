/*
  Warnings:

  - You are about to drop the column `adress` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT;
