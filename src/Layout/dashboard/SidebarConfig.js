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
    title: "categorias",
    path: "/dashboard/categorias",
    icon: getIcon("eos-icons:rotating-gear"),
  },
];

export default sidebarConfig;
