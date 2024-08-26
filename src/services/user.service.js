import User from "../models/User.js";
import { userDTO } from "../dto/user.dto.js";
import { passwordHash } from "../services/bcrypt.service.js";

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

export const createUser = async (username, password, email, is_admin) => {};
