import React, { Fragment, useState, useEffect, useContext } from "react";
import { Tab, Paper, makeStyles, AppBar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { UserContext } from "../../middlewares/ContextAPI";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import CalendarViewTask from "../../components/Task/CalendarViewTask";
import TableViewTask from "../../components/Task/TableViewTask";
import LoadingScreen from "../../components/LoadingScreen";
import AddRepair from "../../components/Repair/AddRepair";

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
}));

const Tasks = () => {
  const classes = useStyles();
  const [value, setValue] = useState("1");
  const [success, setSuccess] = useState("");
  const [err, setError] = useState("");
  const { getStatus, loading, task, getTasks, count } = useContext(UserContext);

  useEffect(() => {
    getTasks();
    getStatus();
  }, [count]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <div style={{ marginBottom: "10px" }}>
        <AddRepair />
        {loading && <LoadingScreen />}
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
      <div className={classes.root}>
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
      </div>
    </Fragment>
  );
};

export default Tasks;
