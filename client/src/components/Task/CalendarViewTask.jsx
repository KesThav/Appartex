import React, { useState, useContext, Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { withStyles } from "@material-ui/core/styles";
import { UserContext } from "../../middlewares/ContextAPI";
import DescriptionIcon from "@material-ui/icons/Description";
import EditTask from "../../components/Task/EditTask";
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
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import moment from "moment";
import { Grid } from "@material-ui/core";
import LoadingScreen from "../../components/LoadingScreen";
import DeleteTask from "../../components/Task/DeleteTask";

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: "center",
  },
  commandButton: {
    backgroundColor: "rgba(255,255,255,0.65)",
    display: "flex",
    flexDirection: "row-reverse",
  },
});

const CalendarViewTask = ({ setSuccess, setError, task }) => {
  const [visible, setVisible] = useState(false);
  const currentDate = moment().format("YYYY-MM-DD");
  const { loading } = useContext(UserContext);
  const [currentViewName, setCurrentViewName] = useState("Month");

  const Header = withStyles(style, { name: "Header" })(
    ({ children, appointmentData, classes, ...restProps }) => (
      <div className={classes.commandButton}>
        <DeleteTask
          id={appointmentData._id}
          setSuccess={setSuccess}
          setError={setError}
        />
        <EditTask
          setSuccess={setSuccess}
          setError={setError}
          setVisible={setVisible}
          visible={visible}
          appointmentData={appointmentData}
        />
      </div>
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
    setCurrentViewName(currentViewName);
  };

  return (
    <Fragment>
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
            <WeekView startDayHour={6} endDayHour={23} />
            <DayView startDayHour={6} endDayHour={23} />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <Appointments />
            <AppointmentTooltip
              headerComponent={Header}
              contentComponent={Content}
              visible={visible}
              onVisibilityChange={() => setVisible(!visible)}
            />
          </Scheduler>
        )}
      </Paper>
    </Fragment>
  );
};

export default CalendarViewTask;
