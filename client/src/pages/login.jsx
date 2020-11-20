import React, { useContext, Fragment, useState } from "react";
import { UserContext } from "../middlewares/ContextAPI";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Hidden,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import jwtDecode from "jwt-decode";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "100vw",
    height: "100vh",
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
    overflow: "hidden",
    minWidth: 350,
    maxWidth: 600,
  },
  box: {
    background: "#072C50",
    width: "100%",
    padding: "5vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  box2: {
    width: "100%",
    paddingTop: "5vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  box3: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    marginTop: "1vh",
    margin: "5vh",
  },
  button: {
    marginTop: 10,
    marginBotton: 10,
  },
  link: {
    textDecoration: "none",
    color: "#fff",
  },
  form: {
    marginBottom: 17,
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const [err, setError] = useState();
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, setLoading } = useContext(UserContext);
  const { setUser } = useContext(UserContext);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Complétez tous les champs");
    } else {
      setLoading(true);
      const data = {
        email,
        password,
      };

      try {
        const res = await axios.post("/auth/login", data);
        localStorage.setItem("authtoken", `Bearer ${res.data}`);
        const decodedToken = jwtDecode(localStorage.authtoken);
        setUser(decodedToken);
        setLoading(false);
        props.history.push("/owner");
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

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
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Typography variant="h4" className={classes.typography}>
              Connexion
            </Typography>{" "}
            {loading && <CircularProgress />}
            <Box className={classes.box3}>
              <form onSubmit={submit} autoComplete="off">
                <TextField
                  required
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Email*"
                  className={classes.form}
                />
                <TextField
                  required
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Mot de passe*"
                  className={classes.form}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.button}
                >
                  Valider
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="inherit"
                  fullWidth
                >
                  <Link className={classes.link} to="/">
                    Retour
                  </Link>
                </Button>
              </form>
            </Box>
          </Box>
          <br />
          <Typography variant="overline">
            Pour vous Inscrire,{" "}
            <Link to="/signup" style={{ textDecoration: "none" }}>
              cliquez ici
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Fragment>
  );
};

export default Login;
