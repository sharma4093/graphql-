/*
  Warnings:

  - You are about to drop the column `bookId` on the `time_slots` table. All the data in the column will be lost.
  - You are about to drop the column `libsId` on the `time_slots` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "time_slots" DROP CONSTRAINT "time_slots_bookId_fkey";

-- DropForeignKey
ALTER TABLE "time_slots" DROP CONSTRAINT "time_slots_libsId_fkey";

-- AlterTable
ALTER TABLE "time_slots" DROP COLUMN "bookId",
DROP COLUMN "libsId";
