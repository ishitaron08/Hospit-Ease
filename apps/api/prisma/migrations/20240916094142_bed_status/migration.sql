/*
  Warnings:

  - You are about to drop the column `bedNo` on the `Patient` table. All the data in the column will be lost.
  - Changed the type of `bedStatus` on the `OPDBed` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('alloted', 'pending', 'failed');

-- CreateEnum
CREATE TYPE "Opdstatus" AS ENUM ('empty', 'full');

-- AlterTable
ALTER TABLE "OPDBed" DROP COLUMN "bedStatus",
ADD COLUMN     "bedStatus" "Opdstatus" NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "bedNo";
