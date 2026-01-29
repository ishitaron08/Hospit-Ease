-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('Waiting', 'Admitted', 'Discharged');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "status" "PatientStatus" NOT NULL DEFAULT 'Waiting';
