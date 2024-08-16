import express from "express";
import sequelize from "../config/db.js";
import cookieParser from "cookie-parser";
import {
    User,
    Supplier,
    Product,
    Order,
    OrderProduct,
    Category,
} from "./models/indexModels.js";

import routes from "./routes/indexRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

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

syncDatabase();

app.use("/", routes);

const port = 3000;

app.listen(port, () => {
    console.log("Listening on", port);
});
