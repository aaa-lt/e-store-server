import { getUserById } from "../services/user.service.js";

export const getMyUser = async (req, res) => {
    try {
        const userDTO = await getUserById(req.userId);
        res.status(200).send(userDTO);
    } catch (error) {
        res.status(404).json({
            status: "error",
            error: error.message,
        });
    }
};
export const getUser = async (req, res) => {
    try {
        const userDTO = await getUserById(req.params.id);
        res.status(200).send(userDTO);
    } catch (error) {
        res.status(404).json({
            status: "error",
            error: error.message,
        });
    }
};
