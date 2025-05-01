/*
  Warnings:

  - You are about to drop the column `Status` on the `books` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "Status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Free';
