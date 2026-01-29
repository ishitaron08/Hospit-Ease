import { Hono } from "hono";
import { adminMiddleware } from "../middleware/admin";
import { getPrisma } from "../lib/prisma";

const hospitalRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

hospitalRouter.post("/hospital", adminMiddleware, async (c) => {
  const { hospitalName, hospitalAddress } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);

  const hospital = await prisma.hospital.create({
    data: {
      hospitalName,
      hospitalAddress,
    },
  });

  return c.json(hospital);
});

hospitalRouter.get("/hospital-deatails", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const hospitals = await prisma.hospital.findMany();
  return c.json(hospitals);
});

hospitalRouter.get("/hospital-deatails/:hospitalId", async (c) => {
  const hospitalId = c.req.param("hospitalId");
  const prisma = getPrisma(c.env.DATABASE_URL);
  const hospital = await prisma.hospital.findFirst({
    where: { hospitalId },
  });
  return c.json(hospital);
});

hospitalRouter.put("/:hospitalId", adminMiddleware, async (c) => {
  const hospitalId = c.req.param("hospitalId");
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { hospitalAddress } = await c.req.json();

  const updatedHospital = await prisma.hospital.update({
    where: { hospitalId },
    data: { hospitalAddress },
  });

  return c.json(updatedHospital);
});

hospitalRouter.delete("/:hospitalId", adminMiddleware, async (c) => {
  const hospitalId = c.req.param("hospitalId");
  const prisma = getPrisma(c.env.DATABASE_URL);

  await prisma.hospital.delete({
    where: { hospitalId },
  });

  return c.json({ message: "Hospital deleted successfully" });
});

export { hospitalRouter };
