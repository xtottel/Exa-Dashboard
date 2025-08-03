import { Router } from "express";
import { getMe } from "../controllers/user/me.controller";
import { updateUser } from "../controllers/user/update.controller";
import { deleteUser } from "../controllers/user/delete.controller";

const router = Router();

router.get("/me", getMe); // GET current user's profile
router.put("/me", updateUser); // PUT update current user's info
router.delete("/me", deleteUser); // DELETE current user's account

export default router;
