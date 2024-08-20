import User from "../models/User.js";

async function isAdmin(req, res, next) {
    const profile = await User.findByPk(req.userId);
    try {
        if (profile.is_admin) {
            req.profile = profile;
            return next();
        }
        res.status(403).json({
            status: "failed",
            error: "No permission",
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to get profile",
        });
    }
}

export default isAdmin;
