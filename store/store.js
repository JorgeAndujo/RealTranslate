import historySlice from "./historySlice";
import savedItemsSlice from "./savedItemsSlice";

const { configureStore } = require("@reduxjs/toolkit");

export default configureStore({
    reducer: {
        history: historySlice,
        savedItems: savedItemsSlice
    }
})