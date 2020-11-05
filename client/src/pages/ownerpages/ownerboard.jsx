import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import MyTable from "../../components/myTable";
import Badges from "../../components/badges";
import {
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";
import BusinessIcon from "@material-ui/icons/Business";
import HomeIcon from "@material-ui/icons/Home";
import FolderIcon from "@material-ui/icons/Folder";
import PeopleIcon from "@material-ui/icons/People";
import HistoryIcon from "@material-ui/icons/History";

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

const AdminDashboard = (props) => {
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
    bill,
    setBill,
    getBills,
    billhistory,
    setBillhistory,
    getBillHistories,
  } = useContext(UserContext);

  useEffect(() => {
    getTenants();
    getBuildings();
    getApparts();
    getContracts();
    getBills();
    getBillHistories();
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Adminboard</Typography>
        </Grid>

        {!tenant ? (
          <CircularProgress />
        ) : (
          <Grid item lg={2} md={12} sm={12} xs={12}>
            <Badges
              icon={<PeopleIcon className={classes.icons} />}
              value={tenant.length}
              style={{ background: "#ff6f00" }}
              name={"Locataires"}
            />
          </Grid>
        )}

        {!building ? (
          <CircularProgress />
        ) : (
          <Grid item lg={2} md={12} sm={12} xs={12}>
            <Badges
              icon={<BusinessIcon className={classes.icons} />}
              value={building.length}
              style={{ background: "#9c27b0" }}
              name={"Immeubles"}
            />
          </Grid>
        )}

        {!appart ? (
          <CircularProgress />
        ) : (
          <Grid item lg={2} md={12} sm={12} xs={12}>
            <Badges
              icon={<HomeIcon className={classes.icons} />}
              value={appart.length}
              style={{ background: "#007bb2" }}
              name={"Appartements"}
            />
          </Grid>
        )}

        {!contract ? (
          <CircularProgress />
        ) : (
          <Grid item lg={2} md={12} sm={12} xs={12}>
            <Badges
              icon={<FolderIcon className={classes.icons} />}
              value={contract.length}
              style={{ background: "#e91e63" }}
              name={"Contrats"}
            />
          </Grid>
        )}

        {!bill ? (
          <CircularProgress />
        ) : (
          <Grid item lg={2} md={12} sm={12} xs={12}>
            <Badges
              icon={<ReceiptIcon className={classes.icons} />}
              value={bill.length}
              style={{ background: "#00a152" }}
              name={"Factures"}
            />
          </Grid>
        )}
        {!billhistory ? (
          <CircularProgress />
        ) : (
          <Grid item lg={2} md={12} sm={12} xs={12}>
            <Badges
              icon={<HistoryIcon className={classes.icons} />}
              value={billhistory.length}
              style={{ background: "#482880" }}
              name={"Historiques des factures"}
            />
          </Grid>
        )}

        {!bill ? (
          <CircularProgress />
        ) : (
          <Grid item lg={6} md={12}>
            <MyTable
              data={bill}
              title={"Dernières factures"}
              link={"/bills"}
              header={["Facture n°", "Date", "Statut"]}
            />
          </Grid>
        )}

        {!contract ? (
          <CircularProgress />
        ) : (
          <Grid item lg={6} md={12}>
            <MyTable
              data={contract}
              title={"Derniers Contrats"}
              link={"/contracts"}
              header={["Contract n°", "Date", "Statut"]}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default AdminDashboard;
