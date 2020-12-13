import React, { Fragment } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const LoadingScreen = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Backdrop
        component={"span"}
        className={classes.backdrop}
        open={true}
        invisible
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Fragment>
  );
};

export default LoadingScreen;
