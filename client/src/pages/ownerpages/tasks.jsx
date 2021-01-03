import React, { Fragment, useState, useEffect, useContext } from "react";
import {
  Tab,
  Paper,
  makeStyles,
  AppBar,
  Hidden,
  ListItem,
  ListItemIcon,
  List,
  Collapse,
  ListItemText,
  Button,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { UserContext } from "../../middlewares/ContextAPI";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import CalendarViewTask from "../../components/Task/CalendarViewTask";
import TableViewTask from "../../components/Task/TableViewTask";
import LoadingScreen from "../../components/LoadingScreen";
import AddTask from "../../components/Task/AddTask";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    background: "transparent",
    backShadow: "none",
    color: "#000000",
    width: "50%",
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

const Tasks = () => {
  const classes = useStyles();
  const [value, setValue] = useState("1");
  const [success, setSuccess] = useState("");
  const [err, setError] = useState("");
  const { getStatus, loading, task, getTasks, count } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getTasks();
    getStatus();
  }, [count]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <AddTask setSuccess={setSuccess} />

      <div style={{ marginBottom: "10px" }}>
        {loading && <LoadingScreen />}
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>

      <div className={classes.root}>
        <Hidden only={["sm", "xs"]}>
          <TabContext value={value}>
            <AppBar
              position="static"
              className={classes.appbar}
              component={Paper}
            >
              <TabList onChange={handleChange}>
                <Tab label="Calendrier" value="1" />
                <Tab label="Tableau" value="2" />
              </TabList>
            </AppBar>
            <TabPanel value="1">
              {task && (
                <CalendarViewTask
                  setError={setError}
                  task={task}
                  setSuccess={setSuccess}
                />
              )}
            </TabPanel>
            <TabPanel value="2">
              {task && (
                <TableViewTask
                  setError={setError}
                  task={task}
                  setSuccess={setSuccess}
                />
              )}
            </TabPanel>
          </TabContext>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <div className={classes.nav}>
            <List component="nav">
              <ListItem>
                <ListItemIcon>
                  <ListItemText primary="Vue" />
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
                      setValue(1);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Calendrier" />
                  </ListItem>
                  <ListItem
                    className={classes.items}
                    button
                    onClick={() => {
                      setValue(2);
                      setOpen(!open);
                    }}
                  >
                    <ListItemText primary="Tableau" />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </div>
          {value == 1 && task && (
            <CalendarViewTask
              setError={setError}
              task={task}
              setSuccess={setSuccess}
            />
          )}
          {value == 2 && task && (
            <TableViewTask
              setError={setError}
              task={task}
              setSuccess={setSuccess}
            />
          )}
        </Hidden>
      </div>
    </Fragment>
  );
};

export default Tasks;
