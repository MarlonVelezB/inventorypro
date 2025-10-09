import React, { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Puedes cambiar esto según tu implementación
// Por ejemplo, si usas cookies, Zustand, Context o JWT
const checkAuth = (): boolean => {
  //const token = localStorage.getItem("token-inventoryflow");
  return true;
};

interface PrivateRouteProps {
  element: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = checkAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 👇 Redirige a login, guardando la ruta a la que el usuario quería ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
