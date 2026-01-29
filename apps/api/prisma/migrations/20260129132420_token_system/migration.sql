/*
  Warnings:

  - You are about to drop the column `address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `ayushmanCard` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosisHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the `Medicine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OPDBed` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenSource" AS ENUM ('ONLINE', 'WALKIN', 'PRIORITY', 'FOLLOWUP');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('QUEUED', 'CALLED', 'COMPLETED', 'CANCELLED', 'NOSHOW');

-- DropForeignKey
ALTER TABLE "OPDBed" DROP CONSTRAINT "OPDBed_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "OPDBed" DROP CONSTRAINT "OPDBed_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_userId_fkey";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "address",
DROP COLUMN "ayushmanCard",
DROP COLUMN "diagnosisHistory",
DROP COLUMN "dob",
DROP COLUMN "sex",
DROP COLUMN "status",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "Medicine";

-- DropTable
DROP TABLE "OPDBed";

-- DropEnum
DROP TYPE "Opdstatus";

-- DropEnum
DROP TYPE "PatientStatus";

-- DropEnum
DROP TYPE "status";

-- CreateTable
CREATE TABLE "Doctor" (
    "doctorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "slotDuration" INTEGER NOT NULL DEFAULT 60,
    "maxPerSlot" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doctorId")
);

-- CreateTable
CREATE TABLE "Token" (
    "tokenId" TEXT NOT NULL,
    "tokenNumber" INTEGER NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "slotStart" TIMESTAMP(3) NOT NULL,
    "source" "TokenSource" NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'QUEUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("tokenId")
);

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("hospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("patientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("doctorId") ON DELETE RESTRICT ON UPDATE CASCADE;
