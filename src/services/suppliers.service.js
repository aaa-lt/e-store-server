import Supplier from "../models/Supplier.js";
import { Op } from "sequelize";

export const getSupplierById = async (id) => {
    return await Supplier.findByPk(id);
};

export const getSupplierByName = async (name) => {
    return await Supplier.findOne({
        where: {
            name: name,
        },
    });
};

export const getSupplierByEmail = async (email) => {
    return await Supplier.findOne({
        where: {
            contact_email: email,
        },
    });
};

export const getSupplierByPhone = async (phone) => {
    return await Supplier.findOne({
        where: {
            phone_number: phone,
        },
    });
};

export const getAllSuppliers = async (reqQuery) => {
    const page = parseInt(reqQuery.page ?? 1);
    const limit = parseInt(reqQuery.limit ?? 10);

    return await Supplier.findAll({
        limit: limit,
        offset: (page - 1) * limit,
    });
};

export const addSupplier = async (reqBody) => {
    await Supplier.create({
        name: reqBody.name,
        contact_email: reqBody.contact_email,
        phone_number: reqBody.phone_number,
    });
};

export const updateSupplierById = async (id, reqBody) => {
    const updates = {};

    for (const key in reqBody) {
        if (Object.prototype.hasOwnProperty.call(reqBody, key)) {
            if (reqBody[key] !== undefined) {
                updates[key] = reqBody[key];
            }
        }
    }

    const supplier = await Supplier.findByPk(id);
    await supplier.update(updates);
};

export const uniqueSupplierCheck = async (reqBody) => {
    return await Supplier.findAll({
        where: {
            [Op.or]: [
                ...(reqBody.contact_email
                    ? [{ contact_email: reqBody.contact_email }]
                    : []),
                ...(reqBody.phone_number
                    ? [{ phone_number: reqBody.phone_number }]
                    : []),
            ],
        },
    });
};
