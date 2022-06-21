import React, { useState, useEffect, useRef } from "react";
import { Card, Typography, Container } from "@mui/material";
import Page from "../components/Page";
import { makeStyles } from "@mui/styles";
import useStore from "../store/store";
import { db } from "../api/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

import useAuth from "../Auth/Auth";
import TablaBandejas from "../components/registroBandejas/TablaBandejas";

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

export default function Bandejas() {
  const open = useStore((state) => state.open);
  const [bandejas, setBandejas] = useState([]);
  const { userData } = useAuth();
  const classes = styles(open);
  const isMounted = useRef(true);

  useEffect(() => {
    const cuid = userData.rol === "bandeja" ? userData.uid : userData.cuid;

    const q = query(collection(db, "bandeja"), where("cuid", "==", cuid));
    onSnapshot(q, (querySnapshot) => {
      let bandejas = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().rut !== userData.rut) {
          bandejas.push(doc.data());
        }
      });
      if (isMounted.current) {
        setBandejas(bandejas);
      }
    });
  }, [userData.uid, userData.cuid, userData.rol, userData.rut]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className={classes.div}>
      <Page title="Gestión Cosecha">
        <Container>
          <Card className={classes.root} variant="outlined">
            <Typography variant="h5" component="h2" className={classes.title}>
              Lista Bandejas
            </Typography>
            <TablaBandejas bandejas={bandejas} />
          </Card>
        </Container>
      </Page>
    </div>
  );
}
