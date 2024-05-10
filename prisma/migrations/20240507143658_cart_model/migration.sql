-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "itemDate" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
