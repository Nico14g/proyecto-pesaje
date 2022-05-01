import React, { useState, useEffect, useRef } from "react";
import { Card, Typography, Container, Grid } from "@mui/material";
import Page from "../components/Page";
import { makeStyles } from "@mui/styles";
import useStore from "../store/store";
import { db } from "../api/firebase";
import {
  collection,
  collectionGroup,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

import useAuth from "../Auth/Auth";
import TablaHistorial from "../components/reportes/TablaHistorial";
import TotalCategoriasCard from "../components/reportes/TotalCategoriasCard";
import MayorCategoria from "../components/reportes/MayorCategoria";

const styles = makeStyles((theme) => ({
  root: {
    minWidth: 500,
    backgroundColor: "#EFFCFF",
    borderWidth: 0,
  },
  div: {
    marginLeft: "5%",
    width: "70vw",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: 20,
    marginTop: 20,
  },
}));

export default function Dashboard() {
  const open = useStore((state) => state.open);
  const [categorias, setCategorias] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [workerRegisters, setWorkerRegisters] = useState([]);
  const [cantidadCategorias, setCantidadCategorias] = useState([]);
  const [mayorCategoria, setMayorCategoria] = useState([]);
  const [menorCategoria, setMenorCategoria] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMayor, setIsLoadingMayor] = useState(true);
  const { userData } = useAuth();
  const classes = styles(open);
  const isMounted = useRef(true);

  const obtenerCategoria = (categories, tipo) => {
    let registers = [];

    categories.map((category) =>
      registers.push(
        category.registers.reduce(
          (partialSum, a) => partialSum + a.acumulate,
          0
        )
      )
    );
    let i;
    if (tipo === "max") {
      i = registers.indexOf(Math.max(...registers));
    } else {
      i = registers.indexOf(Math.min(...registers));
    }

    const categoria = {
      ...categories[i],
      data: categories[i].registers.map((register) => register.acumulate),
    };
    setIsLoadingMayor(false);
    if (tipo === "max") {
      setMayorCategoria(categoria);
    } else {
      setMenorCategoria(categoria);
    }
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const cuid = userData.rol === "company" ? userData.uid : userData.cuid;
    const q = query(collection(db, "category"), where("cuid", "==", cuid));
    let categorias = [];
    let registros = [];
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let registers = [];

        onSnapshot(collection(doc.ref, "registers"), (querySnapshot2) => {
          querySnapshot2.forEach((doc2) => {
            let workerRegisters = [];

            onSnapshot(
              collection(doc2.ref, "workerRegisters"),
              (querySnapshot3) => {
                querySnapshot3.forEach((doc3) => {
                  workerRegisters.push(doc3.data());
                });
                registers.push({
                  ...doc2.data(),
                  workerRegisters: workerRegisters,
                });
                setWorkerRegisters((a) => [...a, workerRegisters]);
              }
            );
          });
        });
        categorias.push({ ...doc.data(), registers: registers });
        registros.push(registers);
      });

      if (isMounted.current) {
        setIsLoading(false);
        setRegistros(registros);
        setCantidadCategorias(categorias.length);
        setCategorias(categorias);
      }
    });
  }, [userData.uid, userData.cuid, userData.rol, userData.run]);

  useEffect(() => {
    if (categorias.length > 0 && registros.length > 0) {
      obtenerCategoria(categorias, "max");
      obtenerCategoria(categorias, "min");
    }
  }, [categorias, registros, workerRegisters]);

  return (
    <Page title="Gestión Cosecha">
      <Container>
        <Card className={classes.root}>
          <Typography variant="h5" component="h2" className={classes.title}>
            Visualización de datos
          </Typography>
          <Grid container spacing={2} style={{ marginLeft: 30 }}>
            <Grid item xs={3}>
              <TotalCategoriasCard
                isLoading={isLoading}
                cantidadCategorias={cantidadCategorias}
              />
            </Grid>
            <Grid item xs={4}>
              <MayorCategoria
                isLoading={isLoadingMayor}
                mayorCategoria={mayorCategoria}
                texto="Mayor Registro"
              />
            </Grid>
            <Grid item xs={4}>
              <MayorCategoria
                isLoading={isLoadingMayor}
                mayorCategoria={menorCategoria}
                texto="Menor Registro"
              />
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
