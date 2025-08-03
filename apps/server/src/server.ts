import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerConfig } from "./docs/swagger";
import { RateLimiter } from "./middleware/rateLimit";
import session from "express-session";
import { BASE_URL } from "./config/constants";

import routes from "./routes";

const app = express();

// Ensure SESSION_SECRET is set in your .env file
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not set");
}

app.use(
  cors({
    origin: BASE_URL, // allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    name: "exa-session", // name of the session
    secret: process.env.SESSION_SECRET,
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

app.use(RateLimiter, routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
