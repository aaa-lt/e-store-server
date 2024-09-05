import { faker } from "@faker-js/faker";
import sequelize from "../config/db.js";
import Category from "./models/Category.js";
import Supplier from "./models/Supplier.js";
import Product from "./models/Product.js";

async function seedDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const categories = Array.from({ length: 10000 }).map((_, index) => ({
            name: `${faker.commerce.department()}${index + 1}`,
            description: faker.lorem.sentence(),
        }));

        const suppliers = Array.from({ length: 10000 }).map((_, index) => ({
            name: faker.company.name(),
            contact_email: `${faker.internet.email()}${index + 1}`,
            phone_number: faker.phone.number({ style: "international" }),
        }));

        await Category.bulkCreate(categories);
        await Supplier.bulkCreate(suppliers);

        const categoryRecords = await Category.findAll();
        const supplierRecords = await Supplier.findAll();

        const products = Array.from({ length: 200000 }).map(() => ({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            quantity: faker.number.int({ min: 1, max: 1000 }),
            price: faker.number.int({ min: 10, max: 10000 }),
            category_id: faker.helpers.arrayElement(categoryRecords).id,
            supplier_id: faker.helpers.arrayElement(supplierRecords).id,
        }));

        await Product.bulkCreate(products);

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await sequelize.close();
    }
}

seedDatabase();
