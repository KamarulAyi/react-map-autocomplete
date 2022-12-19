import { ADD_ITEM } from "../actionTypes/actionTypes";

const initialState = {
  mapData: [],
};

export const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        mapData: [...state.mapData, action.payload]
      };

    default:
      return state;
  }
};
