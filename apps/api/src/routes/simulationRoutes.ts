import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";

const simulationRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const SOURCES = ["ONLINE", "WALKIN", "PRIORITY", "FOLLOWUP"] as const;
const SOURCE_PRIORITY: Record<string, number> = {
  PRIORITY: 1,
  FOLLOWUP: 2,
  ONLINE: 3,
  WALKIN: 4,
};

simulationRouter.post("/simulate", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  let hospital = await prisma.hospital.findFirst();
  if (!hospital) {
    hospital = await prisma.hospital.create({
      data: { hospitalName: "City General Hospital", hospitalAddress: "Delhi" },
    });
  }

  const doctorNames = ["Dr. Sharma", "Dr. Patel", "Dr. Singh"];
  const doctors = [];
  for (const name of doctorNames) {
    const doc = await prisma.doctor.create({
      data: { name, hospitalId: hospital.hospitalId, maxPerSlot: 5 },
    });
    doctors.push(doc);
  }

  const patients = [];
  for (let i = 1; i <= 30; i++) {
    const p = await prisma.patient.create({
      data: {
        name: `Patient ${i}`,
        contact: `98765${i.toString().padStart(5, "0")}`,
      },
    });
    patients.push(p);
  }

  const today = new Date().toISOString().split("T")[0];
  const tokens = [];

  let patientIndex = 0;
  for (const doctor of doctors) {
    for (let hour = 9; hour < 14; hour++) {
      const slotStart = new Date(
        `${today}T${hour.toString().padStart(2, "0")}:00:00`,
      );
      const tokensInSlot = Math.floor(Math.random() * 4) + 2;

      for (let t = 0; t < tokensInSlot && patientIndex < patients.length; t++) {
        const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
        const token = await prisma.token.create({
          data: {
            tokenNumber: t + 1,
            patientId: patients[patientIndex].patientId,
            doctorId: doctor.doctorId,
            slotStart,
            source,
          },
        });
        tokens.push(token);
        patientIndex++;
      }
    }
  }

  const cancellations = [];
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * tokens.length);
    const t = tokens[idx];
    if (t.status === "QUEUED") {
      await prisma.token.update({
        where: { tokenId: t.tokenId },
        data: { status: "CANCELLED" },
      });
      t.status = "CANCELLED";
      cancellations.push(t.tokenId);
    }
  }

  const noshows = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * tokens.length);
    const t = tokens[idx];
    if (t.status === "QUEUED") {
      await prisma.token.update({
        where: { tokenId: t.tokenId },
        data: { status: "NOSHOW" },
      });
      t.status = "NOSHOW";
      noshows.push(t.tokenId);
    }
  }

  const emergencies = [];
  for (let i = 0; i < 2; i++) {
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const hour = 9 + Math.floor(Math.random() * 5);
    const slotStart = new Date(
      `${today}T${hour.toString().padStart(2, "0")}:00:00`,
    );

    const existingTokens = await prisma.token.findMany({
      where: { doctorId: doctor.doctorId, slotStart, status: "QUEUED" },
    });

    for (const et of existingTokens) {
      await prisma.token.update({
        where: { tokenId: et.tokenId },
        data: { tokenNumber: et.tokenNumber + 1 },
      });
    }

    const emergencyPatient = await prisma.patient.create({
      data: { name: `Emergency Patient ${i + 1}`, contact: `911000000${i}` },
    });

    const emergencyToken = await prisma.token.create({
      data: {
        tokenNumber: 1,
        patientId: emergencyPatient.patientId,
        doctorId: doctor.doctorId,
        slotStart,
        source: "PRIORITY",
      },
    });
    emergencies.push(emergencyToken.tokenId);
  }

  const finalQueues = [];
  for (const doctor of doctors) {
    const queue = await prisma.token.findMany({
      where: { doctorId: doctor.doctorId, status: "QUEUED" },
      include: { patient: true },
      orderBy: { tokenNumber: "asc" },
    });

    const sorted = queue.sort((a, b) => {
      const pa = SOURCE_PRIORITY[a.source] || 99;
      const pb = SOURCE_PRIORITY[b.source] || 99;
      if (pa !== pb) return pa - pb;
      return a.tokenNumber - b.tokenNumber;
    });

    finalQueues.push({
      doctor: doctor.name,
      doctorId: doctor.doctorId,
      queue: sorted.map((t, i) => ({
        position: i + 1,
        tokenId: t.tokenId,
        tokenNumber: t.tokenNumber,
        patient: t.patient.name,
        source: t.source,
        slotStart: t.slotStart,
      })),
    });
  }

  return c.json({
    summary: {
      hospital: hospital.hospitalName,
      doctors: doctors.length,
      totalTokens: tokens.length,
      cancellations: cancellations.length,
      noshows: noshows.length,
      emergencies: emergencies.length,
    },
    finalQueues,
  });
});

simulationRouter.delete("/simulate/reset", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  await prisma.token.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.hospital.deleteMany();

  return c.json({ message: "Reset complete" });
});

export { simulationRouter };
