export const userDTO = (user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    is_admin: user.is_admin,
});

export const userCreateDTO = (user) => ({
    id: user.id,
    username: user.username,
    password: user.password,
    email: user.email,
    is_admin: user.is_admin,
});
