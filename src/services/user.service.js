import User from "../models/User.js";
import { userDTO, userPasswordDTO } from "../dto/user.dto.js";
import { passwordCompare } from "./bcrypt.service.js";

export const getUserById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error("User not found");
    }
    return userDTO(user);
};

export const getUserByUsername = async (username) => {
    const user = await User.findOne({
        where: {
            username: username,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return userDTO(user);
};

export const getUserPasswordByUsername = async (username) => {
    const user = await User.scope("withPassword").findOne({
        where: {
            username: username,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return userPasswordDTO(user);
};

export const getUserByEmail = async (email) => {
    const user = await User.findOne({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return userDTO(user);
};

export const createUser = async (user) => {
    await User.create({
        username: user.username,
        password: user.password,
        email: user.email,
    });
};

export const verifyUser = async (unverifiedUser) => {
    try {
        const user = await getUserPasswordByUsername(unverifiedUser.username);
        if (await passwordCompare(unverifiedUser.password, user.password)) {
            return user.id;
        }
    } catch (error) {
        if (error.message === "User not found") {
            return false;
        }
        throw error;
    }
};
