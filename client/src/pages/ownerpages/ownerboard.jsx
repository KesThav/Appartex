import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import MyTable from "../../components/myTable";
import Badges from "../../components/badges";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";
import BusinessIcon from "@material-ui/icons/Business";
import HomeIcon from "@material-ui/icons/Home";
import FolderIcon from "@material-ui/icons/Folder";
import PeopleIcon from "@material-ui/icons/People";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  icons: {
    fontSize: 75,
    color: "#fff",
  },
}));

const AdminDashboard = () => {
  const classes = useStyles();
  const {
    user,
    setUser,
    authAxios,
    tenant,
    setTenant,
    getTenants,
    building,
    setBuilding,
    getBuildings,
    appart,
    setAppart,
    getApparts,
    contract,
    setContract,
    getContracts,
  } = useContext(UserContext);

  useEffect(() => {
    getTenants();
    getBuildings();
    getApparts();
    getContracts();
  }, []);

  const contractHeader = ["Nom", "Prénom", "Date d'entrée", "Statut", "Email"];

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Adminboard</Typography>
        </Grid>

        <Grid item lg={2} md={12} sm={12} xs={12}>
          {tenant && (
            <Badges
              icon={<PeopleIcon className={classes.icons} />}
              value={tenant.length}
              style={{ background: "#ff6f00" }}
              name={"Locataires"}
            />
          )}
        </Grid>

        <Grid item lg={2} md={12} sm={12} xs={12}>
          {building && (
            <Badges
              icon={<BusinessIcon className={classes.icons} />}
              value={building.length}
              style={{ background: "#9c27b0" }}
              name={"Immeubles"}
            />
          )}
        </Grid>

        <Grid item lg={2} md={12} sm={12} xs={12}>
          {appart && (
            <Badges
              icon={<HomeIcon className={classes.icons} />}
              value={appart.length}
              style={{ background: "#007bb2" }}
              name={"Appartements"}
            />
          )}
        </Grid>

        <Grid item lg={2} md={12} sm={12} xs={12}>
          {contract && (
            <Badges
              icon={<FolderIcon className={classes.icons} />}
              value={contract.length}
              style={{ background: "#e91e63" }}
              name={"Contrats"}
            />
          )}
        </Grid>

        <Grid item lg={2} md={12} sm={12} xs={12}>
          {tenant && (
            <Badges
              icon={<ReceiptIcon className={classes.icons} />}
              value={1752}
              style={{ background: "#00a152" }}
              name={"Factures"}
            />
          )}
        </Grid>
        <Grid item lg={2} md={12} sm={12} xs={12}>
          {tenant && (
            <Badges
              icon={<PeopleIcon className={classes.icons} />}
              value={tenant.length}
              style={{ background: "#ff6f00" }}
              name={"Locataires"}
            />
          )}
        </Grid>

        <Grid item lg={6} md={12}>
          {tenant && (
            <MyTable
              data={tenant}
              title={"Dernières factures"}
              link={"/add"}
              header={contractHeader}
            />
          )}
        </Grid>

        <Grid item lg={6} md={12}>
          {tenant && (
            <MyTable
              data={tenant}
              title={"Derniers Contrats"}
              link={"/link"}
              header={contractHeader}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
