import { Hono } from "hono";
import { sign } from "hono/jwt";
import { getPrisma } from "../lib/prisma";

export const adminRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

adminRoute.post("/admin/signup", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const body = await c.req.json();
  const res = await prisma.admin.create({
    data: {
      username: body.username,
      password: body.password,
    },
    select: {
      adminId: true,
    },
  });

  const token = await sign({ adminId: res }, c.env.JWT_SECRET);
  return c.json({ token });
});

adminRoute.post("/admin/signin", async (c) => {
  const body = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);

  const res = await prisma.admin.findFirst({
    where: {
      username: body.username,
    },
    select: {
      adminId: true,
      password: true,
    },
  });

  if (!res) {
    return c.json({ msg: "invalid credentials" });
  }
  const token = await sign({ adminId: res }, c.env.JWT_SECRET);
  return c.json({ token, res }, 200);
});
