import React, { Fragment } from "react";
import { Paper, Box, Typography, makeStyles, Hidden } from "@material-ui/core";
import { Link } from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "row",
    height: 150,
    "&:hover": {
      
    },
  },
  Box: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
  },

  iconBox: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    textDecoration: "none",
  },
}));

const Badges = ({ icon, value, style, name, link }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Link to={link} className={classes.link}>
        <Paper className={classes.paper} square>
          <Box className={classes.Box}>
            <Typography variant="h4">
              {value ? (
                value
              ) : (
                <Skeleton variant="circle" width={40} height={40} />
              )}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {value ? name : <Skeleton width={"100%"} />}
            </Typography>
          </Box>
          <Hidden xsDown>
            <Box className={classes.iconBox} style={style}>
              {icon}
            </Box>
          </Hidden>
        </Paper>
      </Link>
    </Fragment>
  );
};

export default Badges;
