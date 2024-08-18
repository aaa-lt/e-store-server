import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import User from "../models/User.js";

const router = Router();

/**
 * @openapi
 * '/users/me':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get user profile
 *     security:
 *       - Authorization: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/me", verifyToken, async (req, res) => {
    try {
        const profile = await User.findByPk(req.userId);
        res.status(200).send(profile.dataValues);
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
});

/**
 * @openapi
 * '/users/{id}':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get user profile
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 *     security:
 *       - Authorization: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const foundProfile = await User.findByPk(req.params.id);
        if (foundProfile) {
            return res.status(200).send(foundProfile);
        }
        res.status(404).send("Not found");
    } catch (error) {
        res.status(500).send("error");
    }
});

export default router;
