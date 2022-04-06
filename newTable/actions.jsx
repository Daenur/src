export const addItemAction = (item) => ({
    type: 'ADD_ITEM',
    item
});
export const removeItemAction = (item, index) => ({
    type: 'REMOVE_ITEM',
    item,
    index
});
export const changeItemAction = (item, index) => ({
    type: 'CHANGE_ITEM',
    item,
    index
});
export const changeCountAction = (count) => ({
    type: 'CHANGE_COUNT',
    count
});
