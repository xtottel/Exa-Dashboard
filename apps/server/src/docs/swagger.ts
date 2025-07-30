import { authPaths } from "./auth.docs";
import { userPaths } from "./user.docs";

export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Trenclad API",
    description: "API documentation for Trenclad",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:4000/v1",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "trenclad-v1",
      },
    },
  },
  security: [{ cookieAuth: [] }],
  paths: {
    ...authPaths,
    ...userPaths,
  },
};
