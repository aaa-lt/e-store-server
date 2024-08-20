import express from "express";
import sequelize from "../config/db.js";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";
import routes from "./routes/indexRoutes.js";

const app = express();

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await sequelize.sync();
        // await sequelize.sync({ alter: true });
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/", routes);

syncDatabase().then(() => {
    app.listen(port, () => {
        console.log("Listening on", port);
    });
});
