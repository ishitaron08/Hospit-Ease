import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";

const doctorRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>();

doctorRouter.post("/doctor", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { name, hospitalId, slotDuration, maxPerSlot } = await c.req.json();

  const doctor = await prisma.doctor.create({
    data: {
      name,
      hospitalId,
      slotDuration: slotDuration || 60,
      maxPerSlot: maxPerSlot || 10,
    },
  });

  return c.json(doctor);
});

doctorRouter.get("/doctors/:hospitalId", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const hospitalId = c.req.param("hospitalId");

  const doctors = await prisma.doctor.findMany({
    where: { hospitalId },
  });

  return c.json(doctors);
});

doctorRouter.get("/doctor/:id", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const doctorId = c.req.param("id");

  const doctor = await prisma.doctor.findUnique({
    where: { doctorId },
  });

  return c.json(doctor);
});

doctorRouter.get("/doctor/:id/slots", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const doctorId = c.req.param("id");
  const date = c.req.query("date") || new Date().toISOString().split("T")[0];

  const doctor = await prisma.doctor.findUnique({ where: { doctorId } });
  if (!doctor) return c.json({ error: "Doctor not found" }, 404);

  const slots = [];
  const startHour = 9;
  const endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    const slotStart = new Date(
      `${date}T${hour.toString().padStart(2, "0")}:00:00`,
    );
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

    const count = await prisma.token.count({
      where: {
        doctorId,
        slotStart: { gte: slotStart, lt: slotEnd },
        status: { not: "CANCELLED" },
      },
    });

    slots.push({
      slotStart: slotStart.toISOString(),
      slotEnd: slotEnd.toISOString(),
      booked: count,
      available: doctor.maxPerSlot - count,
      maxCapacity: doctor.maxPerSlot,
    });
  }

  return c.json(slots);
});

export { doctorRouter };
