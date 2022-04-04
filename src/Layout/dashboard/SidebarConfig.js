// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={24} height={24} />;

const sidebarConfig = [
  {
    title: "Registro Temporeros",
    path: "/dashboard/registro",
    icon: getIcon("akar-icons:person-add"),
  },
  {
    title: "Reportes",
    path: "/dashboard/reportes",
    icon: getIcon("bxs:report"),
  },
  {
    title: "Configuración",
    path: "/dashboard/configuracion",
    icon: getIcon("eos-icons:rotating-gear"),
  },
];

export default sidebarConfig;
