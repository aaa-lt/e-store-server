import jwt from "jsonwebtoken";
import "dotenv/config";

const createAccessToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.SECRETKEY, {
        expiresIn: "1h",
    });
};

const createRefreshToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.SECRETKEY, {
        expiresIn: "7d",
    });
};

export default { createAccessToken, createRefreshToken };
