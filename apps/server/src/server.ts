import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerConfig } from "./docs/swagger";
import { v1RateLimiter, v2RateLimiter } from "./middleware/rateLimit";
import session from "express-session";

import v1Routes from "./routes/v1";
import v2Routes from "./routes/v2";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    name: "exa-session",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // adjust based on frontend/backend domain setup
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use("/v1", v1RateLimiter, v1Routes);
app.use("/v2", v2RateLimiter, v2Routes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
