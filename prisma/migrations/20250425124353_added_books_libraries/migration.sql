/*
  Warnings:

  - You are about to drop the column `status` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `books` table. All the data in the column will be lost.
  - You are about to drop the `BookedSlots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookedSlots" DROP CONSTRAINT "BookedSlots_book_id_fkey";

-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_userId_fkey";

-- DropIndex
DROP INDEX "books_userId_key";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "status",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "BookedSlots";

-- CreateTable
CREATE TABLE "libraries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "open_timings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "libraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_availibilities" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "libsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_availibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_slots" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "libsId" INTEGER NOT NULL,
    "bAvlId" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "book_availibilities" ADD CONSTRAINT "book_availibilities_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_availibilities" ADD CONSTRAINT "book_availibilities_libsId_fkey" FOREIGN KEY ("libsId") REFERENCES "libraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_libsId_fkey" FOREIGN KEY ("libsId") REFERENCES "libraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_bAvlId_fkey" FOREIGN KEY ("bAvlId") REFERENCES "book_availibilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
