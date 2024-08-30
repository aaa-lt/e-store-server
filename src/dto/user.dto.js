import { passwordHash } from "../services/bcrypt.service.js";

export const userDTO = (user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    is_admin: user.is_admin,
});

export const userCreateDTO = async (user) => ({
    username: user.username,
    password: await passwordHash(user.password),
    email: user.email,
});

export const userPasswordDTO = async (user) => ({
    id: user.id,
    password: user.password,
});

export const userVerifyDTO = async (user) => ({
    username: user.username,
    password: user.password,
});
