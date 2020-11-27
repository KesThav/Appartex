import React, { Fragment } from "react";
import { Paper, makeStyles, Typography, Box } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  style: {
    width: "100%",
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",

    color: "#fff",
    height: "70px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 10,
    boxShadow: "none",
  },
  box: {
    height: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  mainBox: {
    display: "flex",
    flexDirection: " row",
    margin: 10,
  },
}));

const Schedule = ({ data }) => {
  const classes = useStyles();
  return (
    <Fragment>
      {data &&
        data
          .slice(0, 3)
          .filter((data) => moment(data.endDate) > moment())
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
          .map((data, i) => (
            <Box className={classes.mainBox} key={i}>
              <Box className={classes.box}>
                <Typography variant="h4" className={classes.typo}>
                  {moment(data.startDate).format("DD")}
                </Typography>
                <Typography variant="overline" className={classes.typo}>
                  {moment(data.startDate).format("MMMM")}
                </Typography>
              </Box>

              <Paper className={classes.style}>
                <Typography variant="button">
                  {data.title} | {moment(data.startDate).format("HH:MM")}
                </Typography>
                <Typography variant="overline">
                  {data.content} - {moment(data.endDate).format("DD MMMM")} à{" "}
                  {moment(data.endDate).format("HH:MM")}
                </Typography>
              </Paper>
            </Box>
          ))}
    </Fragment>
  );
};

export default Schedule;
