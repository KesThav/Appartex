import React, { useState, useContext, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import UploadImage from "../../components/Appart/UploadImage";
import UploadBillFile from "../../components/Bill/UploadFile";
import UploadContractFile from "../../components/Contract/UploadFile";
import UploadRepairFile from "../../components/Repair/UploadFile";
import UploadTenantFile from "../../components/Tenant/UploadFile";
import Alert from "@material-ui/lab/Alert";
import LoadingScreen from "../../components/LoadingScreen";
import { UserContext } from "../../middlewares/ContextAPI";
import { Typography } from "@material-ui/core";
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
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs() {
  const { loading } = useContext(UserContext);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          <Tab label="Locataires" {...a11yProps(0)} />
          <Tab label="Appartements" {...a11yProps(1)} />
          <Tab label="Contrats" {...a11yProps(2)} />
          <Tab label="Factures" {...a11yProps(3)} />
          <Tab label="Réparations" {...a11yProps(4)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <UploadTenantFile setSuccess={setSuccess} setError={setError} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UploadImage setSuccess={setSuccess} setError={setError} />
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
      </div>
    </Fragment>
  );
}
