import jwt from "jsonwebtoken";
import "dotenv/config";
import { getUserById } from "../services/user.service.js";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token) return res.status(401).json({ error: "Access denied" });

        const decoded = jwt.verify(token, process.env.SECRETKEY);
        req.user = await getUserById(decoded.userId);

        next();
    } catch (error) {
        return res
            .status(401)
            .json({ status: "error", error: "Invalid access token" });
    }
};

export default verifyToken;
