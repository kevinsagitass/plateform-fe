import React from "react";
import { Dashboard } from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import GuestRoute from "./helpers/GuestRoute";
import { LandingPage } from "./pages/LandingPage";
import ProtectedRoute from "./helpers/ProtectedRoute";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: "14px",
            },
          }}
        />
        <HelmetProvider>
          <Routes>
            <Route element={<GuestRoute />}>
              {/* <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} /> */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<LandingPage />} />
            </Route>

            <Route element={<GuestRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </HelmetProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
