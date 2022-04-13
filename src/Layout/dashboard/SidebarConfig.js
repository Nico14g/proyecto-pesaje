// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={24} height={24} />;

const sidebarConfig = [
  {
    title: "registro usuarios",
    path: "/dashboard/registro-usuarios",
    icon: getIcon("akar-icons:person-add"),
  },
  {
    title: "reportes",
    path: "/dashboard/reportes",
    icon: getIcon("bxs:report"),
  },
  {
    title: "categorías",
    path: "/dashboard/categorias",
    icon: getIcon("ci:list-checklist"),
  },
  {
    title: "bandejas",
    path: "/dashboard/bandejas",
    icon: getIcon("ion:file-tray-sharp"),
  },
];

export default sidebarConfig;
