const errorCatcher = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON" });
    }
    res.status(500).json({ message: "Internal Server Error" });
};

export default errorCatcher;
