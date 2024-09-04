export const manipulateProductDTO = (product) => ({
    name: product.name,
    description: product.description,
    quantity: product.quantity,
    price: product.price,
    category_id: product.category_id,
    supplier_id: product.supplier_id,
});
