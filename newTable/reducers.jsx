import { getData } from './data';
import { copyObject } from '@grapecity/wijmo.grid.immutable';
const itemCount = 5000;
const initialState = {
    itemCount,
    items: getData(itemCount),
    idCounter: itemCount
};
export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            {
                // make a clone of the new item which will be added to the
                // items array, and assigns its 'id' property with a unique value.
                let newItem = Object.freeze(copyObject({}, action.item, { id: state.idCounter }));
                return copyObject({}, state, {
                    // items array clone with a new item added
                    items: state.items.concat([newItem]),
                    // increment 'id' counter
                    idCounter: state.idCounter + 1
                });
            }
        case 'REMOVE_ITEM':
            {
                let items = state.items, index = action.index;
                return copyObject({}, state, {
                    // items array clone with the item removed
                    items: items.slice(0, index).concat(items.slice(index + 1))
                });
            }
        case 'CHANGE_ITEM':
            {
                let items = state.items, index = action.index, oldItem = items[index], 
                // create a cloned item with the property changes applied
                clonedItem = Object.freeze(copyObject({}, oldItem, action.item));
                return copyObject({}, state, {
                    // items array clone with the updated item
                    items: items.slice(0, index).
                        concat([clonedItem]).
                        concat(items.slice(index + 1))
                });
            }
        case 'CHANGE_COUNT':
            {
                // create a brand new state with a new data
                let ret = copyObject({}, state, {
                    itemCount: action.count,
                    items: getData(action.count),
                    idCounter: action.count
                });
                return ret;
            }
        default:
            return state;
    }
};
