/*
  Warnings:

  - Added the required column `hospitalAddress` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "hospitalAddress" TEXT NOT NULL,
ALTER COLUMN "hospitalName" SET DEFAULT '';
