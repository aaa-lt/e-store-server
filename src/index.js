import express from "express";
import sequelize from "../config/db.js";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";
import routes from "./routes/index.js";
import errorCatcher from "./utils/catcher.utility.js";
import cors from "cors";

const app = express();

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await sequelize.sync();
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(errorCatcher);
app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, {
        swaggerOptions: { displayRequestDuration: true },
    })
);

app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
    });

    next();
});

app.use("/", routes);

syncDatabase().then(() => {
    app.listen(port, () => {
        console.log("Listening on", port);
    });
});
