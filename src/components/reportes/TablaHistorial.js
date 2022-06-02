import React, { useEffect, useState } from "react";
import { filter } from "lodash";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Alerta } from "../Alert";
import * as locales from "@mui/material/locale";
// material
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { TablaHead } from "../tablas";
import Scrollbar from "../Scrollbar";
import SearchNotFound from "../SearchNotFound";
import useAuth from "../../Auth/Auth";

const TABLE_HEAD = [
  { id: "rut", label: "RUT", alignRight: false },
  { id: "peso", label: "Peso", alignRight: false },
  { id: "fecha", label: "Fecha", alignRight: false },
  { id: "bluetooth", label: "Bluetooth", alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => {
      return (
        _user.peso.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.fecha
          .toDate()
          .toLocaleDateString("es-CL", options)
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
      );
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TablaHistorial(props) {
  const { id, registros } = props;
  const [locale] = useState("esES");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("nombreTarea");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("success");
  const { userData } = useAuth();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = registros?.map((n) => n.nombreTarea);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - registros?.length) : 0;

  const filteredUsers = applySortFilter(
    registros,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    if (registros !== undefined) {
      setLoadingTable(false);
    }
  }, [registros]);

  //   const estructurar = (id, name, registers) => {
  //     let estructura = [];
  //     estructura.push(
  //       registers.map((registro) => {
  //         return {
  //           id: id,
  //           name: registro.firstName + " " + registro.lastName,
  //           run: registro.id,
  //           acumulate: registro.acumulate,
  //           lastDate: registro.lastDate,
  //         };
  //       })
  //     );

  //     console.log(estructura, "estructura");
  //   };

  return (
    <Paper>
      <TableContainer style={{ minHeight: 302, maxHeight: 302 }}>
        {!loadingTable ? (
          <Table stickyHeader>
            <TablaHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={registros?.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      key={row.fecha.toDate()}
                      tabIndex={-1}
                      role="checkbox"
                    >
                      <TableCell align="left">
                        <Typography variant="subtitle2">{id}</Typography>
                      </TableCell>

                      <TableCell align="left">
                        {Number(parseFloat(row.peso).toFixed(1)) + " KG"}
                      </TableCell>
                      <TableCell align="left">
                        {row.fecha
                          .toDate()
                          .toLocaleDateString("es-CL", options)}
                      </TableCell>
                      <TableCell align="left">
                        {row.bluetooth ? "Sí" : "No"}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            {isUserNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                    <SearchNotFound
                      searchFilter={true}
                      searchQuery={filterName}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        ) : (
          <Skeleton variant="rectangular" width="100%" height="370px" />
        )}
      </TableContainer>

      <ThemeProvider
        theme={(outerTheme) => createTheme(outerTheme, locales[locale])}
      >
        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component="div"
          count={registros?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>

      {showAlert && (
        <Alerta
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          color={color}
          message={message}
        />
      )}
    </Paper>
  );
}
