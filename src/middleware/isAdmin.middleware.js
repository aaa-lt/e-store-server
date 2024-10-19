async function isAdmin(req, res, next) {
    const user = req.user;
    try {
        if (user.is_admin) {
            req.user = user;
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
