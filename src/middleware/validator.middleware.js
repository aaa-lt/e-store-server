import { ZodError } from "zod";

const handleValidatingError = (error, res) => {
    if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
            message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json({
            error: "Invalid data",
            details: errorMessages,
        });
    } else {
        console.log(error);
        res.status(500).json({
            error: "Zod Internal Server Error",
        });
    }
};

export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            handleValidatingError(error, res);
        }
    };
};

export const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            handleValidatingError(error, res);
        }
    };
};
