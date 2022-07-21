import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import { Icon } from "@iconify/react";
import documentExport from "@iconify/icons-carbon/document-export";

export default function ExportToExcel(props) {
  const { data, filename, sheetName, setShowAlert, setColor, setMessage } =
    props;

  const toTitleCase = (str) => {
    return (
      str
        .replace(/([A-Z])/g, " $1")
        .charAt(0)
        .toUpperCase() + str.replace(/([A-Z])/g, " $1").slice(1)
    );
  };

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return (
      [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join("/") +
      " " +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(":")
    );
  }

  const generarInfoExcelGeneral = (data, type) => {
    let infoExcel = [];
    Object.entries(data)
      .filter((info) => info[0] !== "cuid" && info[0] !== "idCategoria")
      .forEach((info) => {
        if (info[0] === "registros") {
          if (type === "Cabecera") {
            let objeto = [1, 2, 3, 4, 5];
            Object.entries(info[1][0]).forEach((registro) => {
              if (registro[0] !== "registrosTemporero") {
                if (registro[0] === "idRegistro") {
                  objeto[0] = toTitleCase("Rut");
                }
                if (registro[0] === "acumulado") {
                  objeto[3] = toTitleCase(registro[0]);
                }
                if (registro[0] === "nombreTemporero") {
                  objeto[1] = toTitleCase(registro[0]);
                }
                if (registro[0] === "apellidoTemporero") {
                  objeto[2] = toTitleCase(registro[0]);
                }
                if (registro[0] === "ultimoRegistro") {
                  objeto[4] = toTitleCase(registro[0]);
                }
              }
            });
            infoExcel.push(...objeto);
          } else {
            info[1].forEach((info) => {
              let objeto = [1, 2, 3, 4, 5];
              Object.entries(info).forEach((registro) => {
                if (registro[0] !== "registrosTemporero") {
                  if (type === "Cabecera") {
                    objeto.push(toTitleCase(registro[0]));
                  } else {
                    if (registro[0] !== "ultimoRegistro") {
                      if (registro[0] === "idRegistro") {
                        objeto[0] = registro[1];
                      }
                      if (registro[0] === "acumulado") {
                        objeto[3] = registro[1];
                      }
                      if (registro[0] === "nombreTemporero") {
                        objeto[1] = registro[1];
                      }
                      if (registro[0] === "apellidoTemporero") {
                        objeto[2] = registro[1];
                      }
                    } else {
                      objeto[4] = formatDate(registro[1].toDate());
                    }
                  }
                }
              });
              infoExcel.push([
                infoExcel[0],
                infoExcel[1],
                infoExcel[2],
                ...objeto,
              ]);
            });
          }
        } else {
          if (type === "Cabecera") {
            infoExcel.push(toTitleCase(info[0]));
          } else {
            if (info[0] !== "fechaInicio" && info[0] !== "fechaTermino") {
              infoExcel.push(info[1]);
            } else {
              if (info[0] === "fechaTermino" && info[1] === "") {
                infoExcel.push(info[1]);
              } else {
                infoExcel.push(formatDate(info[1].toDate()));
              }
            }
          }
        }
      });

    return infoExcel;
  };

  const formatDataGeneral = (data) => {
    const cabeceras = [generarInfoExcelGeneral(data, "Cabecera")];
    const info = [generarInfoExcelGeneral(data, "info")];
    info[0].splice(0, 1);
    info[0].splice(0, 1);
    info[0].splice(0, 1);
    return [...cabeceras, ...info[0]];
  };

  const formatDataTemporero = (registrosTemporero) => {
    let cabecera = [
      "Fecha Registro",
      "Peso Original",
      "Peso Neto",
      "Bluetooth",
    ];
    let info = [];
    registrosTemporero.forEach((rt) => {
      info.push([
        formatDate(rt.fecha.toDate()),
        Number(parseFloat(rt.pesoOriginal).toFixed(1)),
        rt.peso,
        rt.bluetooth ? "Sí" : "No",
      ]);
    });
    return [cabecera, ...info];
  };

  const exportar = () => {
    if (data && data.registros.length > 0) {
      let worksheet = XLSX.utils.aoa_to_sheet(formatDataGeneral(data));
      let workSheets = [];
      let sheetNames = [];
      data.registros.forEach((registro) => {
        workSheets.push(
          XLSX.utils.aoa_to_sheet(
            formatDataTemporero(registro.registrosTemporero)
          )
        );
        sheetNames.push(
          registro.idRegistro +
            "-" +
            registro.nombreTemporero +
            " " +
            registro.apellidoTemporero
        );
      });
      let new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, sheetName);
      sheetNames.forEach((sheetName, index) => {
        XLSX.utils.book_append_sheet(
          new_workbook,
          workSheets[index],
          sheetName
        );
      });
      XLSX.writeFile(new_workbook, filename + ".xlsx");
    } else {
      if (setShowAlert !== undefined) {
        setColor("error");
        setMessage("No hay datos que exportar");
        setShowAlert(true);
      }
    }
  };

  return (
    <Button
      variant="contained"
      onClick={exportar}
      startIcon={<Icon icon={documentExport} />}
      style={{ minWidth: "170px", marginTop: 10 }}
    >
      Exportar A Excel
    </Button>
  );
}
