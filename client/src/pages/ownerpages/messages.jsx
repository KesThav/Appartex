import React, { useState, Fragment, useContext, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ShowMessages from "../../components/MessagesComponents/ShowMessages";
import AddMessage from "../../components/MessagesComponents/AddMessage";
import { UserContext } from "../../middlewares/ContextAPI";
import Alert from "@material-ui/lab/Alert";

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

const Drawer = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { user, authAxios, count } = useContext(UserContext);
  const [receivedmessage, setReceivedMessage] = useState("");
  const [sendedmessage, setSendedMessage] = useState("");
  const [archivedmessage, setArchivedMessage] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getMessages = async () => {
    const received = await authAxios.get("/messages/received");
    setReceivedMessage(received.data);
    const send = await authAxios.get("/messages/sended");
    setSendedMessage(send.data);
    const archived = await authAxios.get("/messages/archived");
    setArchivedMessage(archived.data);
  };

  useEffect(() => {
    getMessages();
  }, [count]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <AddMessage getMessages={getMessages} />
      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
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
            {sendedmessage.length > 0 && (
              <ShowMessages
                getMessages={getMessages}
                setError={setError}
                setSuccess={setSuccess}
                message={sendedmessage}
              />
            )}
          </Fragment>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {receivedmessage.length > 0 && (
            <ShowMessages
              getMessages={getMessages}
              setError={setError}
              setSuccess={setSuccess}
              message={receivedmessage}
            />
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {archivedmessage.length > 0 && (
            <ShowMessages
              getMessages={getMessages}
              setError={setError}
              setSuccess={setSuccess}
              message={archivedmessage}
            />
          )}
        </TabPanel>
      </div>
    </Fragment>
  );
};
export default Drawer;
