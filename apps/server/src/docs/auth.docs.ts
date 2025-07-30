export const authPaths = {
  "/auth/signup": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                password: { type: "string" },
                name: { type: "string" },
              },
              required: ["email", "password", "name"],
            },
          },
        },
      },
      responses: {
        201: { description: "User created" },
        400: { description: "Missing fields or email in use" },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Log in a user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string", format: "password" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Login successful" },
        401: { description: "Invalid credentials" },
      },
    },
  },
  "/auth/verify": {
    post: {
      tags: ["Auth"],
      summary: "Verify user email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "token"],
              properties: {
                email: { type: "string", format: "email" },
                token: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Email verified" },
        400: { description: "Missing token" },
        404: { description: "User or token not found" },
      },
    },
  },
  "/auth/recover": {
    post: {
      tags: ["Auth"],
      summary: "Send recovery email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", format: "email" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Recovery email sent" },
        400: { description: "Missing email" },
        404: { description: "User not found" },
      },
    },
  },
  "/auth/reset": {
    post: {
      tags: ["Auth"],
      summary: "Reset user password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["token", "email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                token: { type: "string" },
                password: { type: "string", format: "password" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Password reset successful" },
        400: { description: "Missing or invalid data" },
        404: { description: "Token or user not found" },
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Log out a user",
      responses: {
        200: { description: "Logout successful" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/auth/resend": {
    post: {
      tags: ["Auth"],
      summary: "Resend verification email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", format: "email" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Verification email sent" },
      },
    },
  },
};
