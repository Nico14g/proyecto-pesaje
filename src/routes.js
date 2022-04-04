import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./Layout/dashboard";
//
import Dashboard from "./vistas/Dashboard";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "registro", element: <Dashboard /> },
        { path: "reportes", element: <Dashboard /> },
        { path: "configuracion", element: <Dashboard /> },
        { path: "*", element: <Navigate to="/dashboard/registro" replace /> },
      ],
    },
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
    { path: "*", element: <Navigate to="/dashboard/registro" replace /> },
  ]);
}
