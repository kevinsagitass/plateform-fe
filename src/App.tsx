import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import GuestRoute from "./helpers/GuestRoute";
import LandingPage from "./pages/guest/LandingPage";
import ProtectedRoute from "./helpers/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Terms from "./pages/guest/Terms";
import Privacy from "./pages/guest/Privacy";
import HomePage from "./pages/HomePage";
import OrgDashboard from "./pages/organizations/OrgDashboard";
import TenantDashboard from "./pages/tenants/TenantDashboard";
import OrgUsers from "./pages/organizations/OrgUsers";
import Tenants from "./pages/organizations/Tenants";
import { ThemeProvider } from "./context/ThemeProvider";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
              },
            }}
          />
          <HelmetProvider>
            <Routes>
              <Route element={<GuestRoute />}>
                {/* <Route path="/auth/callback" element={<AuthCallbackPage />} /> */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />}></Route>
                <Route path="/organization/:orgId">
                  <Route path="dashboard" element={<OrgDashboard />} />
                  <Route path="users" element={<OrgUsers />} />
                  <Route path="tenants" element={<Tenants />} />
                  {/* <Route path="reports" element={<OrgReports />} />{" "}
                <Route path="settings" element={<OrgSettings />} /> */}
                </Route>

                <Route path="/organization/:orgId/tenant/:tenantId">
                  <Route path="dashboard" element={<TenantDashboard />} />
                  {/* <Route path="tables" element={<Tables />} />
                <Route path="orders" element={<Orders />} />
                <Route path="reports" element={<TenantReports />} />{" "}
                <Route path="settings" element={<TenantSettings />} /> */}
                </Route>
              </Route>
            </Routes>
          </HelmetProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
