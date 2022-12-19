import { ADD_ITEM, DELETE_ITEM } from "../actionTypes/actionTypes";

const addItem = (value) => {
  return {
    type: ADD_ITEM,
    payload: value
  };
};

const deleteItem = () => {
  return {
    type: DELETE_ITEM,
  };
};

export { addItem, deleteItem };