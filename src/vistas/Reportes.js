import React, { useState, useEffect, useRef } from "react";
import { Card, Typography, Container } from "@mui/material";
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

const styles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
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

export default function Reportes() {
  const open = useStore((state) => state.open);
  const [categorias, setCategorias] = useState([]);
  const { userData } = useAuth();
  const classes = styles(open);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const cuid = userData.rol === "company" ? userData.uid : userData.cuid;
    const q = query(collection(db, "categoria"), where("cuid", "==", cuid));

    onSnapshot(q, (querySnapshot) => {
      let categorias = [];

      querySnapshot.forEach((doc) => {
        let registros = [];

        onSnapshot(collection(doc.ref, "registros"), (querySnapshot2) => {
          querySnapshot2.forEach((doc2) => {
            let registrosTemporero = [];

            onSnapshot(
              collection(doc2.ref, "registrosTemporero"),
              (querySnapshot3) => {
                querySnapshot3.forEach((doc3) => {
                  registrosTemporero.push(doc3.data());
                });
                registros.push(
                  Object.assign(doc2.data(), { registrosTemporero })
                );
              }
            );
          });
        });
        categorias.push(Object.assign(doc.data(), { registros }));
      });
      if (isMounted.current) {
        setCategorias(categorias);
      }
    });
  }, [userData.uid, userData.cuid, userData.rol, userData.rut]);

  return (
    <div className={classes.div}>
      <Page title="Gestión Cosecha">
        <Container>
          <Card className={classes.root} variant="outlined">
            <Typography variant="h5" component="h2" className={classes.title}>
              Reportes
            </Typography>
            <TablaHistorial categorias={categorias} />
          </Card>
        </Container>
      </Page>
    </div>
  );
}
