/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_hospitalId_fkey";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "doctorId",
DROP COLUMN "hospitalId";

-- DropTable
DROP TABLE "Doctor";

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);
