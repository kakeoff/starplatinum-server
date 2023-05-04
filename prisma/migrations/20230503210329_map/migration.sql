/*
  Warnings:

  - You are about to drop the `ApplicationPublications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplicationPublications" DROP CONSTRAINT "ApplicationPublications_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationPublications" DROP CONSTRAINT "ApplicationPublications_publicationId_fkey";

-- DropTable
DROP TABLE "ApplicationPublications";

-- CreateTable
CREATE TABLE "applicationPublications" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "publicationId" INTEGER NOT NULL,

    CONSTRAINT "applicationPublications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applicationPublications" ADD CONSTRAINT "applicationPublications_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicationPublications" ADD CONSTRAINT "applicationPublications_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
