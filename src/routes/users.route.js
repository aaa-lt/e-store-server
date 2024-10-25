import { Router } from "express";
import verifyToken from "../middleware/verifyToken.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import {
    getMyUser,
    getUser,
    userUpdateNameController,
} from "../controllers/users.controller.js";
import upload from "../middleware/upload.middleware.js";
import { uploadProfileImage } from "../controllers/image.controller.js";
import errorCatcher from "../utils/catcher.utility.js";

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

router.get("/me", verifyToken, getMyUser);

/**
 * @openapi
 * '/users/{id}':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get specific user profile
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

router.get("/:id", verifyToken, isAdmin, getUser);

/**
 * @openapi
 * '/users/profile':
 *  patch:
 *     tags:
 *     - User Controller
 *     summary: Patches user name
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - user
 *            properties:
 *              name:
 *                type: string
 *                default: any
 *     responses:
 *      200:
 *        description: Patched Successfully
 *      500:
 *        description: Server Error
 */

router.patch("/profile", verifyToken, userUpdateNameController);

router.post(
    "/profile/upload-image",
    verifyToken,
    upload.single("profileImage"),
    uploadProfileImage
);

router.use(errorCatcher);

export default router;
