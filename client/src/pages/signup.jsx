import React, { Fragment, useContext, useState } from "react";
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
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "100vw",
    [theme.breakpoints.up("sm")]: {
      height: "100vh",
    },
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

const Signup = (props) => {
  const classes = useStyles();
  const { loading, setLoading } = useContext(UserContext);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !lastname || !email || !password || !confirm) {
      setError("Complétez tous les champs");
    } else if (password !== confirm) {
      setError("Les mot de passes ne correspondent pas");
    } else if (password.length < 6) {
      setError("Le mot de passe doit faire minimum 6 charactères");
    } else {
      setLoading(true);
      const data = {
        name,
        lastname,
        email,
        password,
      };
      try {
        await axios.post("/auth/register", data);
        setLoading(false);
        setSuccess("Inscription avec succès, vous pouvez vous connecter");
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
              Inscription
            </Typography>{" "}
            {loading && <CircularProgress />}
            <Box className={classes.box3}>
              <form onSubmit={submit}>
                <TextField
                  id="name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Prénom"
                  className={classes.form}
                />
                <TextField
                  id="lastname"
                  type="text"
                  onChange={(e) => setLastname(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Nom"
                  className={classes.form}
                />
                <TextField
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
                  placeholder="Email"
                  className={classes.form}
                />
                <TextField
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
                  placeholder="Mot de passe"
                  className={classes.form}
                />
                <TextField
                  id="confirm"
                  type="password"
                  onChange={(e) => setConfirm(e.target.value)}
                  fullWidth
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Confirmer le mot de passe"
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
            Pour vous connecter,{" "}
            <Link to="/login" style={{ textDecoration: "none" }}>
              cliquez ici
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Fragment>
  );
};

export default Signup;
