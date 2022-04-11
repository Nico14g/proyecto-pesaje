import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./Layout/dashboard";
import LogoOnlyLayout from "./Layout/LogoOnlyLayout";

import Dashboard from "./vistas/Dashboard";
import Registro from "./vistas/Registro";
import NotFound from "./vistas/NotFound";
import Login from "./vistas/Login";
import useStore from "./store/store";

import { useAuth } from "./Auth/Auth";

// ----------------------------------------------------------------------

const getAdminRoutes = () => {
  return [
    { path: "/", element: <Navigate to="/dashboard/inicio" replace /> },
    { path: "registro-usuarios", element: <Registro /> },
    { path: "reportes", element: <Dashboard /> },
    { path: "configuracion", element: <Dashboard /> },
  ];
};

const getCompanyRoutes = () => {
  return [
    { path: "registro-usuarios", element: <Registro /> },
    { path: "reportes", element: <Dashboard /> },
    { path: "configuracion", element: <Dashboard /> },
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
    }
  };

  const selectAppRoutesChildren = () => {
    const children = [
      { path: "404", element: <NotFound /> },
      { path: "/", element: <Navigate to="/dashboard/registro-usuarios" /> },
      { path: "*", element: <Navigate to="/404" /> },
    ];
    if (userData !== null && userData !== undefined) {
      children.unshift({
        path: "login",
        element: <Navigate to="/dashboard/registro-usuarios" />,
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

export { getAdminRoutes, getCompanyRoutes };
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
