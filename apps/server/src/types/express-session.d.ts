// apps/api/types/express-session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
