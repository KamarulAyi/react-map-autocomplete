import { legacy_createStore as createStore } from "redux";
import { mapReducer } from "./reducers/mapReducers";

const store = createStore(mapReducer);

export default store;