import React, { Fragment } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  CssBaseline,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: "transparent",
    color: "black",
    marginBottom: 20,
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontFamily: "Montserrat",
    textAlign: "center",
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
}));

export const Navbar = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              Appartex
            </Link>
          </Typography>
          <Button color="inherit">
            <Link to="/landing" className={classes.link}>
              Login
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <CssBaseline />
    </Fragment>
  );
};
