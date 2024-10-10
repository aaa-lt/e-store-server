export const metaCalc = (totalItems, page, limit) => {
    page = parseInt(page ?? 1);
    limit = parseInt(limit ?? 10);
    const remaining_items = Math.max(totalItems - page * limit, 0);
    const per_page = limit;
    return {
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / limit),
        current_page: parseInt(page),
        per_page: per_page,
        remaining_items: remaining_items,
    };
};
