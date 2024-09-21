export const metaCalc = (totalItems, page, limit) => {
    return {
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / limit),
        current_page: parseInt(page | 1),
        per_page: parseInt(limit | 10),
        remaining_items: Math.max(totalItems - page * limit, 0),
    };
};
