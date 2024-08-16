import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", verifyToken, (req, res) => {
    res.status(200).json({ message: "Protected route accessed" });
});

export default router;
