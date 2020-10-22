import React, { Fragment } from "react";
import { Paper, Box, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "row",
    height: 150,
  },
  Box: {
    paddingRight: "10%",
    paddingLeft: "10%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  iconBox: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Badges = ({ icon, value, style, name }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Paper className={classes.paper} square>
        <Box className={classes.Box}>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {name}
          </Typography>
        </Box>
        <Box className={classes.iconBox} style={style}>
          {icon}
        </Box>
      </Paper>
    </Fragment>
  );
};

export default Badges;
