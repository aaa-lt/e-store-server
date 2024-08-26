import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token) return res.status(401).json({ error: "Access denied" });
        const decoded = jwt.verify(token, process.env.SECRETKEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default verifyToken;
