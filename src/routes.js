import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./Layout/dashboard";
import LogoOnlyLayout from "./Layout/LogoOnlyLayout";

import Dashboard from "./vistas/Dashboard";
import Registro from "./vistas/Registro";
import Categorias from "./vistas/Categorias";
import Bandejas from "./vistas/Bandejas";
import NotFound from "./vistas/NotFound";
import Login from "./vistas/Login";

import { useAuth } from "./Auth/Auth";

// ----------------------------------------------------------------------

const getAdminRoutes = () => {
  return [
    { path: "registro-usuarios", element: <Registro /> },
    { path: "reportes", element: <Dashboard /> },
    { path: "categorias", element: <Categorias /> },
    { path: "bandejas", element: <Bandejas /> },
  ];
};

const getCompanyRoutes = () => {
  return [
    { path: "registro-usuarios", element: <Registro /> },
    { path: "reportes", element: <Dashboard /> },
    { path: "categorias", element: <Categorias /> },
    { path: "bandejas", element: <Bandejas /> },
  ];
};

const getPlannerRoutes = () => {
  return [
    { path: "reportes", element: <Dashboard /> },
    { path: "categorias", element: <Categorias /> },
    { path: "bandejas", element: <Bandejas /> },
  ];
};
const getNotLoggedInRoutes = () => {
  return [{ path: "*", element: <Navigate to="/login" replace /> }];
};

export default function Router() {
  const { userData } = useAuth();

  const selectChildren = () => {
    if (userData === null || userData === undefined) {
      return getNotLoggedInRoutes();
    } else {
      if (userData.rol === "admin") return getAdminRoutes();
      if (userData.rol === "company") return getCompanyRoutes();
      if (userData.rol === "planner") return getPlannerRoutes();
    }
  };

  const selectAppRoutesChildren = () => {
    const children = [
      { path: "404", element: <NotFound /> },
      { path: "/", element: <Navigate to="/dashboard/reportes" /> },
      { path: "*", element: <Navigate to="/404" /> },
    ];
    if (userData !== null && userData !== undefined) {
      children.unshift({
        path: "login",
        element: <Navigate to="/dashboard/reportes" />,
      });
    } else {
      children.unshift({ path: "login", element: <Login /> });
    }
    return children;
  };

  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: selectChildren(),
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: selectAppRoutesChildren(),
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

export { getAdminRoutes, getCompanyRoutes, getPlannerRoutes };
// {
//   path: '/',
//   element: <LogoOnlyLayout />,
//   children: [
//     { path: '/', element: <Navigate to="/dashboard/app" /> },
//     { path: 'login', element: <Login /> },
//     { path: 'register', element: <Register /> },
//     { path: '404', element: <NotFound /> },
//     { path: '*', element: <Navigate to="/404" /> }
//   ]
// },
//{ path: "*", element: <Navigate to="/dashboard/registro" replace /> },
//]);
//}
