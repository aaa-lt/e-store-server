const isUnique = async (model, name, value) => {
    try {
        const clause = {};
        clause[name] = value;

        const existingValue = await model.findOne({
            where: clause,
        });

        return !!existingValue;
    } catch (error) {
        throw error;
    }
};

export default isUnique;
