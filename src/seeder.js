import { faker } from "@faker-js/faker";
import sequelize from "../config/db.js";
import Category from "./models/Category.js";
import Supplier from "./models/Supplier.js";
import Product from "./models/Product.js";
import OrderProduct from "./models/OrderProduct.js";
import Order from "./models/Order.js";
import User from "./models/User.js";

const syncDatabase = async () => {
    try {
        await sequelize.authenticate({ logging: false });
        console.log("Connection has been established successfully.");
        await sequelize.sync({ force: true, logging: false });
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

async function seedDatabase() {
    try {
        console.time("seedDatabase");
        const transaction = await sequelize.transaction();
        console.time("syncDB");
        await syncDatabase();

        console.timeEnd("syncDB");
        console.time("seedCategories");

        const categories = Array.from({ length: 10000 }).map((_, index) => ({
            name: `${faker.commerce.department()}${index + 1}`,
            description: faker.lorem.sentence(),
        }));

        await Category.bulkCreate(categories, { logging: false });

        console.timeEnd("seedCategories");
        console.time("seedSuppliers");

        const suppliers = Array.from({ length: 10000 }).map((_, index) => ({
            name: faker.company.name(),
            contact_email: `${faker.internet.email()}${index + 1}`,
            phone_number: faker.phone.number({ style: "international" }),
        }));

        await Supplier.bulkCreate(suppliers, { logging: false });

        console.timeEnd("seedSuppliers");
        console.time("seedProducts");

        const [categoryRecords, supplierRecords] = await Promise.all([
            Category.findAll({ logging: false }),
            Supplier.findAll({ logging: false }),
        ]);
        const products = Array.from({ length: 200000 }).map(() => ({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            quantity: faker.number.int({ min: 1, max: 1000 }),
            price: faker.number.int({ min: 10, max: 10000 }),
            category_id: faker.helpers.arrayElement(categoryRecords).id,
            supplier_id: faker.helpers.arrayElement(supplierRecords).id,
        }));

        const BATCH_SIZE = 5000;
        for (let i = 0; i < products.length; i += BATCH_SIZE) {
            const productBatch = products.slice(i, i + BATCH_SIZE);
            await Product.bulkCreate(productBatch, { logging: false });
        }

        await transaction.commit();
        console.timeEnd("seedProducts");
        console.log("Database seeded successfully");
    } catch (error) {
        await transaction.rollback();
        console.error("Error seeding database:", error);
    } finally {
        await sequelize.close();
        console.timeEnd("seedDatabase");
    }
}

seedDatabase();
