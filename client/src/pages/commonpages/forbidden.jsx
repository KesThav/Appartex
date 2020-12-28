import React, { Fragment } from "react";
import { Typography, makeStyles, Box, Hidden } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  typography: {
    fontFamily: "Montserrat",
    textAlign: "center",
    color: "#bdbdbd",
  },
  grid: {
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "column",
  },
}));

function Forbidden() {
  const classes = useStyles();

  return (
    <Fragment>
      <Box className={classes.grid}>
        <Hidden smDown>
          <Typography variant="h1" className={classes.typography}>
            Appartex
          </Typography>
        </Hidden>
        <Hidden only={["lg", "md", "xl"]}>
          <Typography variant="h2" className={classes.typography}>
            Appartex
          </Typography>
        </Hidden>
        <Typography variant="h3" className={classes.typography}>
          403
        </Typography>
        <Typography className={classes.typography}>
          Vous ne pouvez pas accéder à cette page
        </Typography>
      </Box>
    </Fragment>
  );
}

export default Forbidden;
