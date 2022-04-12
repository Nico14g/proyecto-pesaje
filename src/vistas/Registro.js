import React, { useState, useEffect, useRef } from "react";
import { Card, Typography, Container } from "@mui/material";
import Page from "../components/Page";
import { makeStyles } from "@mui/styles";
import useStore from "../store/store";
import { db } from "../api/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

import FormularioEmpleado from "../components/registroTemporero/FormularioEmpleado";
import TablaUsuarios from "../components/registroTemporero/TablaUsuarios";
import useAuth from "../Auth/Auth";

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

export default function Registro() {
  const open = useStore((state) => state.open);
  const [usuarios, setUsuarios] = useState([]);
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
    const q = query(collection(db, "users"), where("cuid", "==", cuid));
    onSnapshot(q, (querySnapshot) => {
      let usuarios = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().run !== userData.run) {
          usuarios.push(doc.data());
        }
      });
      if (isMounted.current) {
        setUsuarios(usuarios);
      }
    });
  }, [userData.uid, userData.cuid, userData.rol, userData.run]);

  return (
    <div className={classes.div}>
      <Page title="Gestión Cosecha">
        <Container>
          <Card className={classes.root} variant="outlined">
            <Typography variant="h5" component="h2" className={classes.title}>
              Lista de Usuarios
            </Typography>
            <TablaUsuarios usuarios={usuarios} />
          </Card>
        </Container>
      </Page>
    </div>
  );
}
