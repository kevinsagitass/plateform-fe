import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./slices/roleSlice";

export const store = configureStore({
  reducer: {
    role: roleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
