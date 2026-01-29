import { Hono } from "hono";
import { sign } from "hono/jwt";
import { getPrisma } from "../lib/prisma";

export const userRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRoute.post("/signup", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const body = await c.req.json();
  const res = await prisma.user.create({
    data: {
      username: body.username,
      useremail: body.useremail,
      password: body.password,
    },
    select: {
      userId: true,
    },
  });

  const token = await sign({ userId: res }, c.env.JWT_SECRET);
  return c.json(token);
});

userRoute.post("/Login", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const body = await c.req.json();
  const res = await prisma.user.findFirst({
    where: {
      useremail: body.useremail,
      password: body.password,
    },
    select: {
      userId: true,
      password: true,
    },
  });
  if (!res) {
    return c.json({ msg: "invalid credentials" });
  }

  const token = await sign({ userId: res }, c.env.JWT_SECRET);
  return c.json({ msg: token });
});
