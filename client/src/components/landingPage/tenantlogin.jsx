import React, { Fragment, useState, useContext } from "react";
import {
  Button,
  makeStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Box,
} from "@material-ui/core";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import { UserContext } from "../../middlewares/ContextAPI";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import jwtDecode from "jwt-decode";
import LoadingScreen from "../LoadingScreen";

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    marginBottom: 17,
  },
  box: {
    width: "100%",
    display: "flex",
    flexDirection: "row-reverse",
  },
}));

const TenantLogin = ({ push }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
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
        const res = await axios.post(
          "https://appartex-server.herokuapp.com/auth/tenant/login",
          data
        );
        localStorage.setItem("authtoken", `Bearer ${res.data}`);
        const decodedToken = jwtDecode(localStorage.authtoken);
        setUser(decodedToken);
        setLoading(false);
        push("/tenant");
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  return (
    <Fragment>
      <Button
        size="large"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => setOpen(!open)}
      >
        Vous êtes locataire, Connectez-vous !
      </Button>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Connexion</DialogTitle>

        <DialogContent>
          {loading && <LoadingScreen />}
          {err && <Alert severity="error">{err}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <br />
          <form onSubmit={submit} autoComplete="off">
            <TextField
              required
              id="email"
              type="email"
              variant="outlined"
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
              variant="outlined"
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
            <Box className={classes.box}>
              <Button
                disabled={loading}
                className={classes.button}
                color="inherit"
                onClick={() => setOpen(!open)}
              >
                Retour
              </Button>
              <Button
                type="submit"
                color="primary"
                className={classes.button}
                disabled={loading}
              >
                Valider
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default TenantLogin;
