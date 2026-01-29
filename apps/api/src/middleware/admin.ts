import { Hono, Context, Next } from "hono";
import { verify, sign, decode } from "hono/jwt";

export async function adminMiddleware(c: Context, next: Next) {
  const token = c.req.header("authorization") || "";

  if (!token) {
    c.status(403);
    return c.json({ msg: "Invalid token" });
  }

  console.log(token);

  try {
    const user = await verify(token, c.env.JWT_SECRET);
    const adminId = user.adminId;

    if (adminId) {
      c.set("adminId", adminId);
      await next();
    } else {
      return c.json({ msg: "Invalid credentials" });
    }
  } catch (err) {
    c.status(500);
    return c.json({ msg: "error while hiting this route" });
  }
}
