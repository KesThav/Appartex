import React, { useState, Fragment, useContext, useEffect } from "react";

import {
  makeStyles,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@material-ui/core";

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
  const [activeFilter, setActiveFilter] = useState([]);

  const getMessages = async () => {
    try {
      const received = await authAxios.get("/messages/received");
      setReceivedMessage(received.data);
      const send = await authAxios.get("/messages/sended");
      setSendedMessage(send.data);
      const archived = await authAxios.get("/messages/archived");
      setArchivedMessage(archived.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  const handleChangefilter = (filter) => {
    if (activeFilter.includes(filter)) {
      const filterIndex = activeFilter.indexOf(filter);
      const newFilter = [...activeFilter];
      newFilter.splice(filterIndex, 1);
      setActiveFilter(newFilter);
    } else {
      setActiveFilter((oldFilter) => [...oldFilter, filter]);
    }
  };

  useEffect(() => {
    getMessages();
  }, [count]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const statut = [
    { value: "Envoyé", label: "envoyé" },
    { value: "En cours", label: "En cours" },
    { value: "Tâche créé", label: "Tâche créé" },
    { value: "Terminé", label: "Terminé" },
  ];

  return (
    <Fragment>
      <AddMessage getMessages={getMessages} />
      <FormControl
        component="fieldset"
        className={classes.formControl}
        style={{ display: "flex", flexDirection: "row", padding: 5 }}
      >
        <FormLabel component="legend">Cochez pour filtrer</FormLabel>
        {statut.map((data, i) => (
          <FormControlLabel
            key={i}
            control={
              <Checkbox
                checked={activeFilter.includes(data.value)}
                name={data._id}
                onChange={() => handleChangefilter(data.value)}
              />
            }
            label={data.label}
          />
        ))}
      </FormControl>
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
        <TabPanel value={value} index={0} style={{ width: "50%" }}>
          <Fragment>
            {sendedmessage.length > 0 && (
              <ShowMessages
                getMessages={getMessages}
                setError={setError}
                setSuccess={setSuccess}
                message={sendedmessage.filter((data) =>
                  activeFilter.length == 0
                    ? data
                    : activeFilter.includes(data.status)
                )}
              />
            )}
          </Fragment>
        </TabPanel>
        <TabPanel value={value} index={1} style={{ width: "50%" }}>
          {receivedmessage.length > 0 && (
            <ShowMessages
              getMessages={getMessages}
              setError={setError}
              setSuccess={setSuccess}
              message={receivedmessage.filter((data) =>
                activeFilter.length == 0
                  ? data
                  : activeFilter.includes(data.status)
              )}
            />
          )}
        </TabPanel>
        <TabPanel value={value} index={2} style={{ width: "50%" }}>
          {archivedmessage.length > 0 && (
            <ShowMessages
              getMessages={getMessages}
              setError={setError}
              setSuccess={setSuccess}
              message={archivedmessage.filter((data) =>
                activeFilter.length == 0
                  ? data
                  : activeFilter.includes(data.status)
              )}
            />
          )}
        </TabPanel>
      </div>
    </Fragment>
  );
};
export default Drawer;
