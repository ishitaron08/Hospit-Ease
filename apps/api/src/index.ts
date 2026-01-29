import { Hono } from "hono";
import { userRoute } from "./routes/userroute";
import { adminRoute } from "./routes/adminRoute";
import { hospitalRouter } from "./routes/hospitalRoutes";
import { tokenRouter } from "./routes/tokenRoutes";
import { doctorRouter } from "./routes/doctorRoutes";
import { simulationRouter } from "./routes/simulationRoutes";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("OPD Token Allocation API");
});

app.route("/home", userRoute);
app.route("/home", adminRoute);
app.route("/home", hospitalRouter);
app.route("/api", tokenRouter);
app.route("/api", doctorRouter);
app.route("/api", simulationRouter);

export default app;
