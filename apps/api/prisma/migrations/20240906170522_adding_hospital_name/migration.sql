/*
  Warnings:

  - Added the required column `hospitalName` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "hospitalName" TEXT NOT NULL;
