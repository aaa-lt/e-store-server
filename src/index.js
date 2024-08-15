import express from "express";
import sequelize from "../config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Supplier from "./models/Supplier.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import OrderProduct from "./models/OrderProduct.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

const app = express();

app.use(express.json());

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await sequelize.sync({ force: false });
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

syncDatabase();

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
    console.log("Listening on 3000");
});
