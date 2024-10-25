import multer from "multer";

const errorCatcher = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res
            .status(400)
            .json({ status: "error", message: "Invalid JSON" });
    }
    if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
    res.status(500).json({ message: "Internal Server Error", error: err });
};

export default errorCatcher;
