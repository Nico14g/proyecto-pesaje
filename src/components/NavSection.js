import { useState } from "react";
import PropTypes from "prop-types";
import {
  NavLink as RouterLink,
  matchPath,
  useLocation,
} from "react-router-dom";
// material
import { alpha, useTheme, styled } from "@mui/material/styles";
import {
  Box,
  List,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";

import { getAdminRoutes, getCompanyRoutes, getPlannerRoutes } from "../routes";
//
import Iconify from "./Iconify";
import useAuth from "../Auth/Auth";

// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)(({ theme, open }) => ({
  width: 22,
  height: 22,
  display: "flex",
  ...(open ? { color: "#4BC74F" } : { color: "grey" }),
}));

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func,
};

function NavItem({ item, active, openSidebar }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: "secondary.main",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
  };

  const activeSubStyle = {
    color: "text.primary",
    fontWeight: "fontWeightMedium",
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle),
          }}
          openSidebar={openSidebar}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info && info}
          <Iconify
            icon={
              open
                ? "eva:arrow-ios-downward-fill"
                : "eva:arrow-ios-forward-fill"
            }
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => {
              const { title, path } = item;
              const isActiveSub = active(path);

              return (
                <ListItemStyle
                  key={title}
                  component={RouterLink}
                  to={path}
                  sx={{
                    ...(isActiveSub && activeSubStyle),
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: "flex",
                        borderRadius: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        float: "left",
                        bgcolor: "text.disabled",
                        transition: (theme) =>
                          theme.transitions.create("transform"),
                        ...(isActiveSub && {
                          transform: "scale(2)",
                          bgcolor: "primary.main",
                        }),
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText
                    primary={title}
                    primaryTypographyProps={{
                      fontSize: 50,
                      fontWeight: "hight",
                      color: "secondary.main",
                    }}
                  />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle),
      }}
    >
      <ListItemIconStyle open={open}>{icon && icon}</ListItemIconStyle>
      <ListItemText
        disableTypography
        primary={title}
        primaryTypographyProps={{
          fontSize: 40,

          color: "secondary.main",
        }}
      />
      {info && info}
    </ListItemStyle>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array,
};

export default function NavSection({ navConfig, open }) {
  const { pathname } = useLocation();
  const { userData } = useAuth();
  const filteredNavConfig = filterNavConfig();

  const match = (path) =>
    path ? !!matchPath({ path, end: false }, pathname) : false;

  function filterNavConfig() {
    if (userData?.rol === "admin") return getAdminNavConfig();
    if (userData?.rol === "company") return getCompanyNavConfig();
    if (userData?.rol === "planner") return getPlannerNavConfig();
  }

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Revisa si las rutas a las que tiene acceso un usuario contienen cierta
  // ruta
  function routesContainPath(routes, path) {
    let pathWithNoSpaces = path.replaceAll(" ", "-");
    pathWithNoSpaces = removeAccents(pathWithNoSpaces);

    return routes.find((r) => r.path === pathWithNoSpaces);
  }

  function getAdminNavConfig() {
    return navConfig.filter((el) =>
      routesContainPath(getAdminRoutes(), el.title)
    );
  }

  function getCompanyNavConfig() {
    return navConfig.filter((el) =>
      routesContainPath(getCompanyRoutes(), el.title)
    );
  }

  function getPlannerNavConfig() {
    return navConfig.filter((el) =>
      routesContainPath(getPlannerRoutes(), el.title)
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: "89vh",
        overflow: "auto",
        backgroundColor: "#F6F6F6",
      }}
    >
      <List>
        {filteredNavConfig &&
          filteredNavConfig.map((item) => (
            <NavItem key={item.title} item={item} active={match} open={open} />
          ))}
      </List>
    </Box>
  );
}
