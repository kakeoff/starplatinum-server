/*
  Warnings:

  - You are about to drop the column `pubs` on the `applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "applicationPublications" ADD COLUMN     "publicationDate" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "pubs";
