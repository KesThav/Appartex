import React, { useState, Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Sendmessages from "../../components/sendmessages";
import Receivemessages from "../../components/receivemessages";
import Archivedmessages from "../../components/archivedmessage";
import AddMessage from "../../components/AddMessage";
import { UserContext } from "../../middlewares/ContextAPI";

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
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
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
    display: "flex",
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { user } = useContext(UserContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <AddMessage />
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Messages envoyés" {...a11yProps(0)} />

          <Tab label="Messages reçus" {...a11yProps(1)} />
          {user && user.role == "Admin" ? (
            <Tab label="Messages Archivés" {...a11yProps(2)} />
          ) : null}
        </Tabs>
        <TabPanel value={value} index={0}>
          <Fragment>
            <Sendmessages />
          </Fragment>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Receivemessages />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Archivedmessages />
        </TabPanel>
      </div>
    </Fragment>
  );
}
