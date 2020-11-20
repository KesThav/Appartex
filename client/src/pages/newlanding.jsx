import React, { Fragment } from "react";
import {
  Box,
  Button,
  makeStyles,
  Container,
  Typography,
  Divider,
  CssBaseline,
  Hidden,
} from "@material-ui/core";
import Login from "../components/landingPage/login";
import TenantLogin from "../components/landingPage/tenantlogin";
import Signup from "../components/landingPage/signup";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: "100vh",
    width: "100vw",
    minWidth: "360px",
  },
  mainBox: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    display: "flex",
    flexDirection: "row",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  typography: {
    fontFamily: "Montserrat",
    textAlign: "center",
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
}));

const Newlanding = (props) => {
  const classes = useStyles();

  return (
    <Fragment>
      <CssBaseline />
      <Container className={classes.root}>
        <Box className={classes.mainBox}>
          <Box className={classes.box}>
            <Hidden only={["lg", "md", "xl"]}>
              <Typography className={classes.typography} variant="h2">
                Appartex
              </Typography>
            </Hidden>
            <Hidden smDown>
              <Typography className={classes.typography} variant="h1">
                Appartex
              </Typography>
            </Hidden>

            <Typography variant="subtitle1">
              Une application de gestion pour propriétaires indépendants
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box className={classes.box}>
            <Signup push={props.history.push} />
            <Login push={props.history.push} />
            <TenantLogin push={props.history.push} />
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default Newlanding;
