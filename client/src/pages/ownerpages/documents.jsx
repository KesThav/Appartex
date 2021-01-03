import React, { useState, useContext, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Hidden,
  ListItem,
  ListItemIcon,
  List,
  Collapse,
  ListItemText,
  Box,
  Container,
  Tabs,
  Tab,
  Button,
  Typography,
} from "@material-ui/core";
import UploadImage from "../../components/Appart/UploadImage";
import UploadBillFile from "../../components/Bill/UploadFile";
import UploadContractFile from "../../components/Contract/UploadFile";
import UploadRepairFile from "../../components/Repair/UploadFile";
import UploadTenantFile from "../../components/Tenant/UploadFile";
import Alert from "@material-ui/lab/Alert";
import LoadingScreen from "../../components/LoadingScreen";
import { UserContext } from "../../middlewares/ContextAPI";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
          <Box>{children}</Box>
        </Container>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "transparent",
    display: "flex",
    height: 333,
    [theme.breakpoints.down("sm")]: {
      display: "grid",
      height: 150,
    },
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  nav: {
    marginBottom: 10,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  items: {
    textAlign: "center",
  },
}));

export default function VerticalTabs() {
  const { loading } = useContext(UserContext);
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <Typography variant="h3">Gérer les documents</Typography>
      <div style={{ marginBottom: "10px" }}>
        {loading && <LoadingScreen />}
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
      <div className={classes.root}>
        <Hidden only={["sm", "xs"]}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            className={classes.tabs}
          >
            <Tab label="Appartements" {...a11yProps(0)} />
            <Tab label="Locataires" {...a11yProps(1)} />
            <Tab label="Contrats" {...a11yProps(2)} />
            <Tab label="Factures" {...a11yProps(3)} />
            <Tab label="Réparations" {...a11yProps(4)} />
          </Tabs>

          <TabPanel value={value} index={0}>
            <UploadImage setSuccess={setSuccess} setError={setError} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UploadTenantFile setSuccess={setSuccess} setError={setError} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <UploadContractFile setSuccess={setSuccess} setError={setError} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <UploadBillFile setSuccess={setSuccess} setError={setError} />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <UploadRepairFile setSuccess={setSuccess} setError={setError} />
          </TabPanel>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <div className={classes.nav}>
            <List component="nav">
              <ListItem>
                <ListItemIcon>
                  <ListItemText primary="Catégories" />
                  <Button
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: open,
                    })}
                    onClick={() => setOpen(!open)}
                  >
                    <ExpandMoreIcon />
                  </Button>
                </ListItemIcon>
              </ListItem>
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                className={classes.nav}
              >
                <List component="div" disablePadding>
                  <ListItem
                    className={classes.items}
                    button
                    onClick={() => {
                      setValue(0);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Appartements" />
                  </ListItem>
                  <ListItem
                    className={classes.items}
                    button
                    onClick={() => {
                      setValue(1);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Locataires" />
                  </ListItem>
                  <ListItem
                    className={classes.items}
                    button
                    onClick={() => {
                      setValue(2);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Contrats" />
                  </ListItem>
                  <ListItem
                    className={classes.items}
                    button
                    onClick={() => {
                      setValue(3);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Factures" />
                  </ListItem>
                  <ListItem
                    className={classes.items}
                    button
                    onClick={() => {
                      setValue(4);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Réparations" />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </div>

          {value == 0 && (
            <UploadImage setSuccess={setSuccess} setError={setError} />
          )}

          {value == 1 && (
            <UploadTenantFile setSuccess={setSuccess} setError={setError} />
          )}

          {value == 2 && (
            <UploadContractFile setSuccess={setSuccess} setError={setError} />
          )}

          {value == 3 && (
            <UploadBillFile setSuccess={setSuccess} setError={setError} />
          )}

          {value == 4 && (
            <UploadRepairFile setSuccess={setSuccess} setError={setError} />
          )}
        </Hidden>
      </div>
    </Fragment>
  );
}
