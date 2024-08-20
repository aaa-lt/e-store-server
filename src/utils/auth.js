import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

const verifyUser = async (user, pass) => {
    try {
        if (user === null || !(await bcrypt.compare(pass, user.password))) {
            return false;
        }
        return true;
    } catch (error) {
        throw error;
    }
};

const createAccessToken = (userId) => {
    return (
        "Bearer " +
        jwt.sign({ userId: userId }, process.env.SECRETKEY, {
            expiresIn: "1h",
        })
    );
};

const createRefreshToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.SECRETKEY, {
        expiresIn: "1d",
    });
};

export default { verifyUser, createAccessToken, createRefreshToken };
