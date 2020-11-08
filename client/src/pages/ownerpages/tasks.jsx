import React, { Fragment, useState, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { UserContext } from "../../middlewares/ContextAPI";
import DescriptionIcon from "@material-ui/icons/Description";
import {
  Scheduler,
  MonthView,
  DayView,
  WeekView,
  Appointments,
  TodayButton,
  DateNavigator,
  Toolbar,
  AppointmentTooltip,
  AppointmentForm,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import moment from "moment";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  TextField,
  MenuItem,
  Box,
  Button,
  Grid,
  Hidden,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import LoadingScreen from "../../components/LoadingScreen";

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: "center",
  },
  /*   header: {
    height: "260px",
    backgroundSize: "cover",
  }, */
  commandButton: {
    backgroundColor: "rgba(255,255,255,0.65)",
    float: "right",
  },
});

const useStyle = makeStyles({
  table: {
    minWidth: 650,
    maxWidth: "100%",
  },
  box: {
    marginBottom: 20,
  },
  form: {
    marginBottom: 17,
  },
  box2: {
    display: "flex",
    flexDirection: "row-reverse",
  },
});

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const currentDate = moment().format("YYYY-MM-DD");
  const {
    authAxios,
    user,
    setLoading,
    getStatus,
    status,
    loading,
    task,
    getTasks,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [statusid, setStatusid] = useState("");
  const [success, setSuccess] = useState("");
  const [messageid, setMessageid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentViewName, setCurrentViewName] = useState("Month");
  const [taskid, setTaskid] = useState("");
  const classes = useStyle();

  useEffect(() => {
    getTasks();
    getStatus();
  }, [count]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!startDate || !endDate || !messageid || !title || !content) {
      setError("Complétez tous les champs");
    } else if (startDate > endDate) {
      setError("jfggh");
    } else {
      setLoading(true);
      const data = {
        startDate,
        endDate,
        messageid,
        title,
        content,
        status: statusid,
      };
      try {
        const res = await authAxios.put(`/tasks/update/${taskid}`, data);
        setSuccess("Task modifié avec succès");
        setCount((count) => count + 1);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const deleteTask = async (taskid) => {
    /* setDeleteShow(!deleteShow); */
    setLoading(true);
    try {
      await authAxios.delete(`/tasks/delete/${taskid}`);
      setLoading(false);
      setSuccess("Task supprimé avec succès");
      setCount((count) => count + 1);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const Header = withStyles(style, { name: "Header" })(
    ({ children, appointmentData, classes, ...restProps }) => (
      <Fragment>
        <IconButton className={classes.commandButton}>
          <DeleteIcon onClick={() => deleteTask(appointmentData._id)} />
        </IconButton>
        <IconButton
          onClick={() => {
            setOpen(!open);
            setError("");
            setSuccess("");
            setTitle(appointmentData.title);
            setContent(appointmentData.content);
            setStartDate(
              moment(appointmentData.startDate).format("YYYY-MM-DDTHH:MM")
            );
            setEndDate(
              moment(appointmentData.endDate).format("YYYY-MM-DDTHH:MM")
            );
            setMessageid(appointmentData.messageid._id);
            setStatusid(appointmentData.status._id);
            setTaskid(appointmentData._id);
          }}
          className={classes.commandButton}
        >
          <EditIcon />
        </IconButton>
      </Fragment>
    )
  );

  const Content = withStyles(style, { name: "Content" })(
    ({ children, appointmentData, classes, ...restProps }) => (
      <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData}
      >
        <Grid container alignItems="center">
          <Grid item xs={2} className={classes.textCenter}>
            <DescriptionIcon className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            <span>{appointmentData.content}</span>
          </Grid>
        </Grid>
      </AppointmentTooltip.Content>
    )
  );

  const currentViewNameChange = (currentViewName) => {
    console.log(currentViewName);
    setCurrentViewName(currentViewName);
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      <Paper>
        {task && (
          <Scheduler data={task}>
            <ViewState
              DefaultCurrentDate={currentDate}
              currentViewName={currentViewName}
              onCurrentViewNameChange={currentViewNameChange}
            />
            <MonthView />
            <WeekView startDayHour={9} endDayHour={19} />
            <DayView startDayHour={9} endDayHour={19} />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <Appointments />
            <AppointmentTooltip
              headerComponent={Header}
              contentComponent={Content}
            />
            <AppointmentForm />
          </Scheduler>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Editer une tâche</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit}>
            <TextField
              id="messageid"
              type="string"
              variant="outlined"
              value={messageid}
              fullWidth
              disabled
              placeholder="messageid"
              className={classes.form}
            />
            <TextField
              id="title"
              variant="outlined"
              type="string"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              fullWidth
              placeholder="Titre"
              className={classes.form}
            />

            <TextField
              id="content"
              type="text"
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              placeholder="Description"
              className={classes.form}
            />
            <TextField
              variant="outlined"
              id="Status"
              select
              value={statusid}
              label="Statut"
              onChange={(e) => setStatusid(e.target.value)}
              fullWidth
              className={classes.form}
            >
              {status &&
                status.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              id="date du début"
              type="datetime-local"
              variant="outlined"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              placeholder="Description"
              className={classes.form}
            />
            <TextField
              id="date de fin"
              type="datetime-local"
              variant="outlined"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              fullWidth
              placeholder="Description"
              className={classes.form}
            />

            <Box className={classes.box2}>
              <Button
                className={classes.button}
                color="inherit"
                onClick={() => {
                  setOpen(!open);
                  setMessageid("");
                }}
              >
                Retour
              </Button>

              <Button type="submit" color="primary" className={classes.button}>
                Valider
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
