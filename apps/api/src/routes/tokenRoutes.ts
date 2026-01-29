import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";

const tokenRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>();

const SOURCE_PRIORITY: Record<string, number> = {
  PRIORITY: 1,
  FOLLOWUP: 2,
  ONLINE: 3,
  WALKIN: 4,
};

tokenRouter.post("/token/book", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const {
    patientId,
    doctorId,
    slotStart,
    source,
    patientName,
    patientContact,
  } = await c.req.json();

  const slotDate = new Date(slotStart);
  const slotEnd = new Date(slotDate.getTime() + 60 * 60 * 1000);

  const count = await prisma.token.count({
    where: {
      doctorId,
      slotStart: { gte: slotDate, lt: slotEnd },
      status: { not: "CANCELLED" },
    },
  });

  const doctor = await prisma.doctor.findUnique({ where: { doctorId } });
  if (count >= (doctor?.maxPerSlot || 10)) {
    return c.json({ error: "Slot full" }, 400);
  }

  let finalPatientId = patientId;
  if (!finalPatientId && patientName && patientContact) {
    const patient = await prisma.patient.create({
      data: { name: patientName, contact: patientContact },
    });
    finalPatientId = patient.patientId;
  }

  const token = await prisma.token.create({
    data: {
      tokenNumber: count + 1,
      patientId: finalPatientId,
      doctorId,
      slotStart: slotDate,
      source,
    },
  });

  return c.json(token);
});

tokenRouter.post("/token/:id/cancel", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const tokenId = c.req.param("id");

  const token = await prisma.token.update({
    where: { tokenId },
    data: { status: "CANCELLED" },
  });

  await reorderQueue(prisma, token.doctorId, token.slotStart);
  return c.json(token);
});

tokenRouter.post("/token/:id/noshow", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const tokenId = c.req.param("id");

  const token = await prisma.token.update({
    where: { tokenId },
    data: { status: "NOSHOW" },
  });

  await reorderQueue(prisma, token.doctorId, token.slotStart);
  return c.json(token);
});

tokenRouter.post("/token/emergency", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { patientId, doctorId, slotStart } = await c.req.json();

  const slotDate = new Date(slotStart);

  const tokens = await prisma.token.findMany({
    where: {
      doctorId,
      slotStart: slotDate,
      status: "QUEUED",
    },
  });

  for (const t of tokens) {
    await prisma.token.update({
      where: { tokenId: t.tokenId },
      data: { tokenNumber: t.tokenNumber + 1 },
    });
  }

  const token = await prisma.token.create({
    data: {
      tokenNumber: 1,
      patientId,
      doctorId,
      slotStart: slotDate,
      source: "PRIORITY",
    },
  });

  return c.json(token);
});

tokenRouter.get("/token/queue/:doctorId", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const doctorId = c.req.param("doctorId");

  const tokens = await prisma.token.findMany({
    where: { doctorId, status: "QUEUED" },
    include: { patient: true },
    orderBy: { tokenNumber: "asc" },
  });

  const sorted = tokens.sort((a, b) => {
    const pa = SOURCE_PRIORITY[a.source] || 99;
    const pb = SOURCE_PRIORITY[b.source] || 99;
    if (pa !== pb) return pa - pb;
    return a.tokenNumber - b.tokenNumber;
  });

  return c.json(sorted);
});

tokenRouter.post("/token/:id/call", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const tokenId = c.req.param("id");

  const token = await prisma.token.update({
    where: { tokenId },
    data: { status: "CALLED" },
  });

  return c.json(token);
});

tokenRouter.post("/token/:id/complete", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const tokenId = c.req.param("id");

  const token = await prisma.token.update({
    where: { tokenId },
    data: { status: "COMPLETED" },
  });

  return c.json(token);
});

// Get token status by contact number
tokenRouter.get("/token/status/:contact", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const contact = c.req.param("contact");

  const patient = await prisma.patient.findFirst({
    where: { contact },
  });

  if (!patient) {
    return c.json([]);
  }

  const tokens = await prisma.token.findMany({
    where: {
      patientId: patient.patientId,
    },
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate queue position for queued tokens
  const tokensWithPosition = await Promise.all(
    tokens.map(async (token) => {
      if (token.status === "QUEUED") {
        const queueAhead = await prisma.token.count({
          where: {
            doctorId: token.doctorId,
            slotStart: token.slotStart,
            status: "QUEUED",
            tokenNumber: { lt: token.tokenNumber },
          },
        });
        return { ...token, queuePosition: queueAhead };
      }
      return token;
    }),
  );

  return c.json(tokensWithPosition);
});

// Get all patients (for emergency page dropdown)
tokenRouter.get("/patients", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const patients = await prisma.patient.findMany({
    orderBy: { name: "asc" },
    take: 100,
  });

  return c.json(patients);
});

// Create a new patient
tokenRouter.post("/patients", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { name, contact } = await c.req.json();

  const patient = await prisma.patient.create({
    data: { name, contact },
  });

  return c.json(patient);
});

async function reorderQueue(
  prisma: ReturnType<typeof getPrisma>,
  doctorId: string,
  slotStart: Date,
) {
  const tokens = await prisma.token.findMany({
    where: {
      doctorId,
      slotStart,
      status: "QUEUED",
    },
    orderBy: { tokenNumber: "asc" },
  });

  const sorted = tokens.sort((a, b) => {
    const pa = SOURCE_PRIORITY[a.source] || 99;
    const pb = SOURCE_PRIORITY[b.source] || 99;
    if (pa !== pb) return pa - pb;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  for (let i = 0; i < sorted.length; i++) {
    await prisma.token.update({
      where: { tokenId: sorted[i].tokenId },
      data: { tokenNumber: i + 1 },
    });
  }
}

export { tokenRouter };
