import Supplier from "../models/Supplier.js";

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

export const getAllSuppliers = async () => {
    return await Supplier.findAll();
};

export const addSupplier = async (reqBody) => {
    await Supplier.create({
        name: reqBody.name,
        contact_email: reqBody.contact_email,
        phone_number: reqBody.phone_number,
    });
};
