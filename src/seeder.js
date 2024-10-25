import { faker } from "@faker-js/faker";
import sharp from "sharp";
import { nanoid } from "nanoid";
import sequelize from "../config/db.js";
import Category from "./models/category.js";
import Supplier from "./models/supplier.js";
import Product from "./models/product.js";
import OrderProduct from "./models/orderProduct.js";
import Order from "./models/order.js";
import User from "./models/user.js";
import { containerClient } from "../config/azure.js";

async function uploadImageToAzure(blobName, imageBuffer) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(imageBuffer);

    return blockBlobClient.url;
}

async function compressAndUploadImage(fileName, imageBuffer) {
    const resolutions = {
        full: 1000,
        middle: 500,
        low: 100,
        potato: 10,
    };

    const imagePaths = {};

    for (const [quality, size] of Object.entries(resolutions)) {
        const compressedImage = await sharp(imageBuffer)
            .resize(size, size)
            .png({ quality: 80 })
            .toBuffer();
        const blobName = `products/${quality}/${fileName}`;
        const imageUrl = await uploadImageToAzure(blobName, compressedImage);
        imagePaths[quality] = imageUrl;
    }

    return imagePaths;
}

async function generateRandomImageBuffer(width, height) {
    const boxWidth = Math.floor(width * 0.4);
    const boxHeight = Math.floor(height * 0.4);
    const boxX = Math.floor((width - boxWidth) / 2);
    const boxY = Math.floor((height - boxHeight) / 2);

    const color1 = {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };
    const color2 = {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };

    const gradientBuffer = Buffer.alloc(width * height * 3);
    for (let y = 0; y < height; y++) {
        const ratio = y / height;
        const r = Math.round(color1.r * (1 - ratio) + color2.r * ratio);
        const g = Math.round(color1.g * (1 - ratio) + color2.g * ratio);
        const b = Math.round(color1.b * (1 - ratio) + color2.b * ratio);

        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 3;
            gradientBuffer[idx] = r;
            gradientBuffer[idx + 1] = g;
            gradientBuffer[idx + 2] = b;
        }
    }

    return sharp({
        create: {
            width,
            height,
            channels: 3,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    })
        .composite([
            { input: gradientBuffer, raw: { width, height, channels: 3 } },
            {
                input: {
                    create: {
                        width: boxWidth,
                        height: boxHeight,
                        channels: 4,
                        background: { r: 255, g: 255, b: 255, alpha: 1 },
                    },
                },
                top: boxY,
                left: boxX,
            },
            await createRandomShape(boxWidth, boxHeight, boxX, boxY),
        ])
        .png()
        .toBuffer();
}

async function createRandomShape(width, height, offsetX, offsetY) {
    const shapeType = Math.floor(Math.random() * 3);

    // Circle buffer
    if (shapeType === 0) {
        return {
            input: await sharp({
                create: {
                    width,
                    height,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 0 },
                },
            })
                .composite([
                    {
                        input: Buffer.from(
                            `<svg><circle cx="${width / 2}" cy="${
                                height / 2
                            }" r="${
                                Math.min(width, height) / 4
                            }" fill="blue" /></svg>`
                        ),
                        top: 0,
                        left: 0,
                    },
                ])
                .png()
                .toBuffer(),
            top: offsetY,
            left: offsetX,
        };
    }

    // Rectangle buffer
    return {
        input: await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite([
                {
                    input: Buffer.from(
                        `<svg><rect x="${width / 4}" y="${height / 4}" width="${
                            width / 2
                        }" height="${height / 2}" fill="red" /></svg>`
                    ),
                    top: 0,
                    left: 0,
                },
            ])
            .png()
            .toBuffer(),
        top: offsetY,
        left: offsetX,
    };
}

const syncDatabase = async () => {
    try {
        await sequelize.authenticate({ logging: false });
        console.log("Connection has been established successfully.");
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

        const [categoryRecords, supplierRecords] = await Promise.all([
            Category.findAll({ logging: false }),
            Supplier.findAll({ logging: false }),
        ]);

        const products = [];

        for (let i = 0; i < 50; i++) {
            const fileName = `product_${nanoid()}.png`;
            const imageBuffer = await generateRandomImageBuffer(1000, 1000);
            const imagePaths = await compressAndUploadImage(
                fileName,
                imageBuffer
            );

            products.push({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                quantity: faker.number.int({ min: 1, max: 1000 }),
                price: faker.number.int({ min: 10, max: 10000 }),
                category_id: faker.helpers.arrayElement(categoryRecords).id,
                supplier_id: faker.helpers.arrayElement(supplierRecords).id,
                image_url: imagePaths.full,
            });

            console.log(`Uploaded and compressed image ${i + 1}`);
        }

        console.timeEnd("generateImages");
        console.time("seedProducts");

        const BATCH_SIZE = 5000;
        for (let i = 0; i < products.length; i += BATCH_SIZE) {
            const productBatch = products.slice(i, i + BATCH_SIZE);
            await Product.bulkCreate(productBatch, { logging: false });
        }

        await transaction.commit();

        console.timeEnd("seedProducts");
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await sequelize.close();
        console.timeEnd("seedDatabase");
    }
}

seedDatabase();
