import express from "express";
import sequelize from "../config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Supplier from "./models/Supplier.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
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

const getUsers = async () => {
    try {
        const users = await User.findAll();
        console.log("users:", JSON.stringify(users, null, 2));
    } catch (err) {
        console.log("Error while getting users:", err);
    }
};

syncDatabase();

// const jane = await User.create({
//     username: "Jane",
//     password: "Doe",
//     email: "DDD",
// });

// console.log("Jane's auto-generated ID:", jane.id);

getUsers();

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// app.get("/products", function (req, res) {
//     return res.send("Hellow");
// });

// app.get("/products/:id", function (req, res) {
//     const id = req.params.id;

//     // const index = findProductIndexById(id);

//     if (index > -1) {
//         // return res.send(products[index]);
//     } else {
//         res.status(404).send("Product not found");
//     }
// });

// app.post("/products/", (req, res) => {
//     console.log(req.body);
//     if (!req.body.name) return res.sendStatus(400);

//     const productName = req.body.name;
//     const product = {
//         name: productName,
//     };

//     product.id = id++;

//     // products.push(product);
//     res.sendStatus(200);
// });

app.listen(3000, () => {
    console.log("Listening on 3000");
});
