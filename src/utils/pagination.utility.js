export const metaCalc = (totalItems, page, limit) => {
    page = parseInt(page ?? 1);
    console.log(limit);
    limit = parseInt(limit ?? 10);
    console.log(limit);
    return {
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / limit),
        current_page: parseInt(page),
        per_page: parseInt(limit),
        remaining_items: Math.max(totalItems - page * limit, 0),
    };
};
