import { getUserById } from "../services/user.service.js";

async function isAdmin(req, res, next) {
    const profile = await getUserById(req.userId);
    try {
        if (profile.is_admin) {
            return next();
        }
        res.status(403).json({
            status: "error",
            error: "No permission",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: "Failed to get profile",
        });
    }
}

export default isAdmin;
