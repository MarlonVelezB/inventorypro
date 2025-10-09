import ErrorBoundary from "../components/ErrorBoundary";
import ScrollToTop from "../components/ScrollToTop";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import {
  ClientManagement,
  Dashboard,
  LoginPage,
  NotFound,
  PreInvoiceGenerator,
  ProductManagement,
  WarehouseManagement,
} from "../pages";
import PrivateLayout from "./PrivateLayout";
import PrivateRoute from "./PrivateRoute";

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute element={<PrivateLayout />} />}>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/pre-invoice-generator"
              element={<PreInvoiceGenerator />}
            />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/warehouse-management"
              element={<WarehouseManagement />}
            />
            <Route path="/client-management" element={<ClientManagement />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
