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
  Hidden,
  ListItem,
  ListItemIcon,
  List,
  Collapse,
  ListItemText,
  Button,
} from "@material-ui/core";

import ShowMessages from "../../components/Message/ShowMessages";
import AddMessage from "../../components/Message/AddMessage";
import { UserContext } from "../../middlewares/ContextAPI";
import Alert from "@material-ui/lab/Alert";
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
    backgroundColor: "transparent",
    display: "flex",
    height: 224,
    [theme.breakpoints.down("sm")]: {
      display: "grid",
      height: 50,
    },
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  width: {
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  statut: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },

  nav: {
    marginBottom: 10,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  items: {
    textAlign: "center",
  },
}));

const Drawer = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { user, authAxios, count, setLoading } = useContext(UserContext);
  const [receivedmessage, setReceivedMessage] = useState("");
  const [sendedmessage, setSendedMessage] = useState("");
  const [archivedmessage, setArchivedMessage] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState([]);
  const [open, setOpen] = useState(false);

  const getMessages = async () => {
    try {
      setLoading(true);
      const received = await authAxios.get("/messages/received");
      setReceivedMessage(received.data);
      const send = await authAxios.get("/messages/sended");
      setSendedMessage(send.data);
      const archived = await authAxios.get("/messages/archived");
      setArchivedMessage(archived.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
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
    { value: "envoyé", label: "Envoyé" },
    { value: "En cours", label: "En cours" },
    { value: "Tâche créé", label: "Tâche créé" },
    { value: "Terminé", label: "Terminé" },
  ];

  return (
    <Fragment>
      <AddMessage getMessages={getMessages} setSuccess={setSuccess} />
      <FormControl component="fieldset" className={classes.statut}>
        <FormLabel component="legend">Cochez pour filtrer</FormLabel>
        {statut.map((data, i) => (
          <FormControlLabel
            className={classes.items}
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
        <Hidden only={["sm", "xs"]}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            className={classes.tabs}
          >
            <Tab label="Messages envoyés" {...a11yProps(0)} />

            <Tab label="Messages reçus" {...a11yProps(1)} />
            {user && user.role == "Admin" ? (
              <Tab label="Messages Archivés" {...a11yProps(2)} />
            ) : null}
          </Tabs>
          <TabPanel value={value} index={0} className={classes.width}>
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
          <TabPanel value={value} index={1} className={classes.width}>
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
          <TabPanel value={value} index={2} className={classes.width}>
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
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <div className={classes.nav}>
            <List component="nav">
              <ListItem>
                <ListItemIcon>
                  <ListItemText primary="Messages" />
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
                    <ListItemText primary="Messages envoyés" />
                  </ListItem>
                  <ListItem
                    className={classes.items}
                    button
                    onClick={() => {
                      setValue(1);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Messages reçus" />
                  </ListItem>
                  <ListItem
                    className={classes.items}
                    button
                    onClick={() => {
                      setValue(2);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Messages archivés" />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </div>
          {value == 0 && sendedmessage.length > 0 && (
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
          {value == 1 && receivedmessage.length > 0 && (
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
        </Hidden>
      </div>
    </Fragment>
  );
};
export default Drawer;
