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
