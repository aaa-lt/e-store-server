import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";
import sequelize from "../config/db.js";
import Category from "./models/category.js";
import Supplier from "./models/supplier.js";
import Product from "./models/product.js";
import OrderProduct from "./models/orderProduct.js";
import Order from "./models/order.js";
import User from "./models/user.js";

function cleanUpImagesDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    } else {
        fs.readdirSync(dirPath).forEach((file) => {
            const filePath = path.join(dirPath, file);
            fs.unlinkSync(filePath);
        });
    }
}

function drawRandomShape(context, x, y, width, height) {
    const shapeType = Math.floor(Math.random() * 3);
    context.fillStyle = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;

    switch (shapeType) {
        case 0:
            context.beginPath();
            context.moveTo(
                x + Math.random() * width,
                y + Math.random() * height
            ); // Vertex 1
            context.lineTo(
                x + Math.random() * width,
                y + Math.random() * height
            ); // Vertex 2
            context.lineTo(
                x + Math.random() * width,
                y + Math.random() * height
            ); // Vertex 3
            context.closePath();
            context.fill();
            break;
        case 1:
            const radius = Math.min(width, height) / 4;
            context.beginPath();
            context.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
            context.fill();
            break;
        case 2:
            const rectWidth = (Math.random() * width) / 2;
            const rectHeight = (Math.random() * height) / 2;
            context.fillRect(
                x + Math.random() * (width - rectWidth),
                y + Math.random() * (height - rectHeight),
                rectWidth,
                rectHeight
            );
            break;
    }
}

function generateRandomGradientImage(width, height, outputFilePath) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    const color1 = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
    const color2 = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const rectSize = 500;
    const centerX = (width - rectSize) / 2;
    const centerY = (height - rectSize) / 2;

    context.fillStyle = "white";
    context.fillRect(centerX, centerY, rectSize, rectSize);

    drawRandomShape(context, centerX, centerY, rectSize, rectSize);

    const buffer = canvas.toBuffer("image/png", { compressionLevel: 0 });
    fs.writeFileSync(outputFilePath, buffer);
}

function resizeAndSaveImage(
    inputPath,
    outputPath,
    newWidth,
    newHeight,
    callback
) {
    loadImage(inputPath)
        .then((image) => {
            const canvas = createCanvas(newWidth, newHeight);
            const context = canvas.getContext("2d");

            // Изменение размера изображения
            context.drawImage(image, 0, 0, newWidth, newHeight);

            const buffer = canvas.toBuffer("image/png");
            fs.writeFileSync(outputPath, buffer);

            if (callback) {
                callback();
            }
        })
        .catch((err) => {
            console.error(`Failed to load image for resizing: ${err}`);
        });
}

function generateImages(numImages, width, height, dirPath) {
    cleanUpImagesDirectory(dirPath);

    const fileNames = [];

    for (let i = 1; i <= numImages; i++) {
        const fileName = `product_${i}.png`;
        const outputFilePath = path.join(dirPath, fileName);

        generateRandomGradientImage(width, height, outputFilePath);

        fileNames.push(fileName);

        console.log(`Generated image ${i + 1}`);
    }

    console.log(`\nSuccessfully generated ${numImages} images in ${dirPath}.`);
    return fileNames;
}

function compressImagesToSizes(
    fileNames,
    srcDir,
    middleDir,
    lowDir,
    potatoDir
) {
    cleanUpImagesDirectory(middleDir);
    cleanUpImagesDirectory(lowDir);
    cleanUpImagesDirectory(potatoDir);

    fileNames.forEach((fileName, index) => {
        const srcPath = path.join(srcDir, fileName);
        const middlePath = path.join(middleDir, fileName);
        const lowPath = path.join(lowDir, fileName);
        const potatoPath = path.join(potatoDir, fileName);

        resizeAndSaveImage(srcPath, middlePath, 500, 500, () => {
            console.log(`Resized image ${index + 1} to 500x500`);
        });

        resizeAndSaveImage(srcPath, lowPath, 100, 100, () => {
            console.log(`Resized image ${index + 1} to 100x100`);
        });

        resizeAndSaveImage(srcPath, potatoPath, 10, 10, () => {
            console.log(`Resized image ${index + 1} to 10x10`);
        });
        console.log(`Compressed image ${index + 1}`);
    });

    console.log(`\nSuccessfully resized images to middle and low sizes.`);
}

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

        const categories = Array.from({ length: 50 }).map((_, index) => ({
            name: `${faker.commerce.department()}${index + 1}`,
            description: faker.lorem.sentence(),
        }));

        await Category.bulkCreate(categories, { logging: false });

        console.timeEnd("seedCategories");
        console.time("seedSuppliers");

        const suppliers = Array.from({ length: 50 }).map((_, index) => ({
            name: faker.company.name(),
            contact_email: `${faker.internet.email()}${index + 1}`,
            phone_number: faker.phone.number({ style: "international" }),
        }));

        await Supplier.bulkCreate(suppliers, { logging: false });

        console.timeEnd("seedSuppliers");

        console.time("generateImages");
        try {
            const fullImagesDir = "images/full";
            const middleImagesDir = "images/middle";
            const lowImagesDir = "images/low";
            const potatoImagesDir = "images/potato";

            const fileNames = generateImages(100, 1000, 1000, fullImagesDir);
            compressImagesToSizes(
                fileNames,
                fullImagesDir,
                middleImagesDir,
                lowImagesDir,
                potatoImagesDir
            );
        } catch (error) {
            console.log(error);
        }
        console.timeEnd("generateImages");

        console.time("seedProducts");

        const [categoryRecords, supplierRecords] = await Promise.all([
            Category.findAll({ logging: false }),
            Supplier.findAll({ logging: false }),
        ]);
        const products = Array.from({ length: 100 }).map((_, index) => ({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            quantity: faker.number.int({ min: 1, max: 1000 }),
            price: faker.number.int({ min: 10, max: 10000 }),
            category_id: faker.helpers.arrayElement(categoryRecords).id,
            supplier_id: faker.helpers.arrayElement(supplierRecords).id,
            image_url: `product_${index + 1}.png`,
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
