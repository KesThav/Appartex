import React, { useContext, useEffect } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import MyTable from "../../components/myTable";
import Badges from "../../components/badges";
import { Grid, Typography, makeStyles, Paper, Hidden } from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";
import BusinessIcon from "@material-ui/icons/Business";
import HomeIcon from "@material-ui/icons/Home";
import FolderIcon from "@material-ui/icons/Folder";
import PeopleIcon from "@material-ui/icons/People";
import TimelineIcon from "@material-ui/icons/Timeline";
import Schedule from "../../components/Schedule";
import { Link } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

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
  link: {
    textDecoration: "none",
    color: [theme.palette.primary.dark],
    paddingLeft: 10,
  },
}));

const AdminDashboard = (props) => {
  const classes = useStyles();
  const {
    tenant,
    getTenants,
    building,
    getBuildings,
    appart,
    getApparts,
    contract,
    getContracts,
    bill,
    getBills,
    getRepairs,
    repair,
    getTasks,
    task,
    getStatus,
    loading,
  } = useContext(UserContext);
  const theme = useTheme();
  const breakValue = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    getTenants();
    getBuildings();
    getApparts();
    getContracts();
    getBills();
    getRepairs();
    getTasks();
    getStatus();
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Accueil</Typography>
        </Grid>
        <Grid item lg={2} md={6} sm={6} xs={6}>
          <Badges
            icon={<PeopleIcon className={classes.icons} />}
            value={tenant.length}
            style={{ background: "#ff6f00" }}
            style2={{
              background: breakValue && "#ff6f00",
              color: breakValue && "#fff",
            }}
            name={"Locataires"}
            link={"/tenants"}
          />
        </Grid>
        <Grid item lg={2} md={6} sm={6} xs={6}>
          <Badges
            icon={<BusinessIcon className={classes.icons} />}
            value={building.length}
            style={{ background: "#9c27b0" }}
            style2={{
              background: breakValue && "#9c27b0",
              color: breakValue && "#fff",
            }}
            name={"Immeubles"}
            link={"/buildings"}
          />
        </Grid>
        <Grid item lg={2} md={6} sm={6} xs={6}>
          <Badges
            icon={<HomeIcon className={classes.icons} />}
            value={appart.length}
            style={{ background: "#007bb2" }}
            style2={{
              background: breakValue && "#007bb2",
              color: breakValue && "#fff",
            }}
            name={"Appartements"}
            link={"/appartments"}
          />
        </Grid>
        <Grid item lg={2} md={6} sm={6} xs={6}>
          <Badges
            icon={<FolderIcon className={classes.icons} />}
            value={contract.length}
            style={{ background: "#e91e63" }}
            style2={{
              background: breakValue && "#e91e63",
              color: breakValue && "#fff",
            }}
            name={"Contrats"}
            link={"/contracts"}
          />
        </Grid>
        <Grid item lg={2} md={6} sm={6} xs={6}>
          <Badges
            icon={<ReceiptIcon className={classes.icons} />}
            value={bill.length}
            style={{ background: "#00a152" }}
            style2={{
              background: breakValue && "#00a152",
              color: breakValue && "#fff",
            }}
            name={"Factures"}
            link={"/bills"}
          />
        </Grid>
        <Grid item lg={2} md={6} sm={6} xs={6}>
          <Badges
            icon={<TimelineIcon className={classes.icons} />}
            value={repair.length}
            style={{ background: "#482880" }}
            style2={{
              background: breakValue && "#482880",
              color: breakValue && "#fff",
            }}
            name={"Réparations"}
            link={"/repairs"}
          />
        </Grid>
        <Hidden smDown>
          <Grid item lg={6} md={12}>
            <MyTable
              data={bill}
              title={"Dernières factures"}
              link={"/bills"}
              header={["Locataire", "Date", "Statut"]}
              text={"Voir toutes les factures"}
            />
          </Grid>
          <Grid item lg={6} md={12}>
            <MyTable
              data={contract}
              title={"Derniers Contrats"}
              link={"/contracts"}
              header={["Locataire", "Date", "Statut"]}
              text={"Voir tous les contrats"}
            />
          </Grid>
        </Hidden>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {task && (
            <Paper style={{ paddingTop: 15 }}>
              <Typography
                variant="h6"
                color="primary"
                style={{ paddingLeft: 10 }}
              >
                Les tâches prévues
              </Typography>
              <Schedule data={task} />
              <Typography variant="overline">
                <Link to={"/tasks"} className={classes.link}>
                  Voir toutes les tâches
                </Link>
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
