import bcrypt from "bcrypt";

export const passwordHash = async (password) => {
    return bcrypt.hash(password, 10);
};

export const passwordCompare = async (password, userPassword) => {
    return bcrypt.compare(password, userPassword);
};
