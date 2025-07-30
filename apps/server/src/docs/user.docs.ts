export const userPaths = {
  "/user/me": {
    get: {
      tags: ["User"],
      summary: "Get current user's profile",
      responses: {
        200: {
          description: "User data retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  bio: { type: "string" },
                  image: { type: "string", format: "uri" },
                  // Add any additional fields returned
                },
              },
            },
          },
        },
        404: { description: "User not found" },
        401: { description: "Unauthorized" },
      },
      security: [{ cookieAuth: [] }],
    },
  },

  "/user/update": {
    put: {
      tags: ["User"],
      summary: "Update user profile",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                bio: { type: "string" },
                image: { type: "string", format: "uri" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "User updated successfully" },
        400: { description: "Invalid input" },
        401: { description: "Unauthorized" },
      },
      security: [{ cookieAuth: [] }],
    },
  },

  "/user/delete": {
    delete: {
      tags: ["User"],
      summary: "Delete current user",
      responses: {
        204: { description: "User deleted successfully" },
        401: { description: "Unauthorized" },
      },
      security: [{ cookieAuth: [] }],
    },
  },
};
