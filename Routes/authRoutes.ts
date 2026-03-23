import { Router } from "express";
import { login } from "../Controllers/authController.js";

const router = Router();

//localhost:3000/auth/login
router.post("/login", login);

export default router;