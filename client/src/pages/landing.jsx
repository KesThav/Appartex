import React, { Component, Fragment, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: "100vh",
    width: "100vw",
  },
  typography: {
    fontFamily: "Montserrat",
    textAlign: "center",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "column",
  },
  box: {
    background: "#072C50",
    padding: "5vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  box2: {
    paddingTop: "5vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingRight: "2vh",
    paddingLeft: "2vh",
  },
  box3: {
    display: "flex",
    flexDirection: "column",
    marginTop: "1vh",
  },

  box4: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "3vh",
    textAlign: "center",
  },
  button: {
    marginBottom: "2vh",
    textDecoration: "none",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
  },
});

const Landing = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Container className={classes.root}>
        <Paper square className={classes.paper} elevation={4} boxshadow={3}>
          <Box className={classes.box}>
            <Hidden smDown>
              <Typography
                style={{ color: "#fff" }}
                variant="h1"
                className={classes.typography}
              >
                ApparteX
              </Typography>
            </Hidden>
            <Hidden only={["lg", "md", "xl"]}>
              <Typography
                style={{ color: "#fff" }}
                variant="h2"
                className={classes.typography}
              >
                ApparteX
              </Typography>
            </Hidden>
            <Typography variant="subtitle1" style={{ color: "#fff" }}>
              Une application de gestion pour propriétaires indépendants
            </Typography>
          </Box>
          <Box className={classes.box2}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              className={classes.button}
            >
              <Link className={classes.link} to="/login">
                Vous êtes Propriétaire, connectez-vous !
              </Link>
            </Button>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              className={classes.button}
            >
              <Link className={classes.link} to="/signup">
                Vous êtes Propriétaire, inscrivez-vous !
              </Link>
            </Button>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              className={classes.button}
            >
              <Link className={classes.link} to="/tenant/login">
                Vous êtes Locataire, connectez-vous !
              </Link>
            </Button>{" "}
          </Box>

          <br />
          <div className={classes.box4}>
            <Typography variant="overline">
              Travail de Bachelor. Kesigan Thavarajasingam ©
            </Typography>
          </div>
        </Paper>
      </Container>
    </Fragment>
  );
};

export default Landing;
