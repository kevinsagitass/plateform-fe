import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./slices/roleSlice";
import persistReducer from "redux-persist/es/persistReducer";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";

const storage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(localStorage.getItem(key))
  },
  setItem: (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value)
    return Promise.resolve()
  },
  removeItem: (key: string): Promise<void> => {
    localStorage.removeItem(key)
    return Promise.resolve()
  },
}

const rolePersistConfig = {
  key: "role",
  storage,
};

const persistedRoleReducer = persistReducer(rolePersistConfig, roleReducer);

export const store = configureStore({
  reducer: {
    role: persistedRoleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
