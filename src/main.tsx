import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-primary-500" size={28} />
          </div>
        }
        persistor={persistor}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
