// apps/server/src/routes/v1/user.ts

/**
 * @file user.ts
 * @description This file defines the user routes for the application.
 * It includes routes for user authentication, user management, and other related functionality.
 * @requires express
 * @requires auth.ts
 * @requires user.ts
 */

import { Router } from "express";
import { getMe } from "../../controllers/v1/user/me.controller";
import { updateUser } from "../../controllers/v1/user/update.controller";
import { deleteUser } from "../../controllers/v1/user/delete.controller";

const router = Router();

router.get("/me", getMe); // GET current user's profile
router.put("/me", updateUser); // PUT update current user's info
router.delete("/me", deleteUser); // DELETE current user's account

export default router;
