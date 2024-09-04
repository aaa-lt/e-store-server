import Supplier from "../models/Supplier.js";

export const getSupplierById = async (id) => {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
        return undefined;
    }
    return supplier;
};

export const getSupplierByName = async (name) => {
    const supplier = await Supplier.findOne({
        where: {
            name: name,
        },
    });
    if (!supplier) {
        return undefined;
    }
    return supplier;
};

export const getSupplierByEmail = async (email) => {
    const supplier = await Supplier.findOne({
        where: {
            contact_email: email,
        },
    });
    if (!supplier) {
        return undefined;
    }
    return supplier;
};

export const getSupplierByPhone = async (phone) => {
    const supplier = await Supplier.findOne({
        where: {
            phone_number: phone,
        },
    });
    if (!supplier) {
        return undefined;
    }
    return supplier;
};

export const getAllSuppliers = async () => {
    return await Supplier.findAll();
};

export const addSupplier = async (supplier) => {
    await Supplier.create({
        name: supplier.name,
        contact_email: supplier.contact_email,
        phone_number: supplier.phone_number,
    });
};
