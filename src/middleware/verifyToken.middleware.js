import jwt from "jsonwebtoken";
import "dotenv/config";
import { tokenRefreshService } from "../services/user.service.js";

const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token) return res.status(401).json({ error: "Access denied" });
        const decoded = jwt.verify(token, process.env.SECRETKEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        try {
            const accessToken = tokenRefreshService(req.cookies);
            if (accessToken) {
                req.headers["authorization"] = accessToken;
                const decoded = jwt.verify(
                    accessToken.split(" ")[1],
                    process.env.SECRETKEY
                );
                req.userId = decoded.userId;
                res.header("Authorization", accessToken);
                return next();
            }
            res.status(400).json({
                status: "error",
                error: "No token provided",
            });
        } catch (error) {
            return res
                .status(400)
                .json({ status: "error", error: "Invalid refresh token" });
        }
    }
};

export default verifyToken;
