import jwt from "jsonwebtoken";
import "dotenv/config";

const secretKey = "your-secret-key";

function verifyToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });
    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
}

export default verifyToken;
