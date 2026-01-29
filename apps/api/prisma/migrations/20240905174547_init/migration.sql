-- CreateTable
CREATE TABLE "Patient" (
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "bedNo" TEXT NOT NULL,
    "ayushmanCard" TEXT NOT NULL,
    "diagnosisHistory" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patientId")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "doctorId" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "availability" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doctorId")
);

-- CreateTable
CREATE TABLE "OPDBed" (
    "hospitalId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "bedStatus" TEXT NOT NULL,

    CONSTRAINT "OPDBed_pkey" PRIMARY KEY ("hospitalId","patientId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "medicineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manufactured" TIMESTAMP(3) NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("medicineId")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("hospitalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_useremail_key" ON "User"("useremail");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("doctorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("hospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("hospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OPDBed" ADD CONSTRAINT "OPDBed_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("patientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OPDBed" ADD CONSTRAINT "OPDBed_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("hospitalId") ON DELETE RESTRICT ON UPDATE CASCADE;
