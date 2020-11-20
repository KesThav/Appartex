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
import PersonIcon from "@material-ui/icons/Person";

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

const Login = ({ push }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
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
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => setOpen(!open)}
      >
        Vous êtes Propriétaire, Inscrivez-vous !
      </Button>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Inscription</DialogTitle>

        <DialogContent>
          {err && <Alert severity="error">{err}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <br />
          <form onSubmit={submit} autoComplete="off">
            <TextField
              required
              id="name"
              type="text"
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Prénom*"
              className={classes.form}
            />
            <TextField
              variant="outlined"
              required
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
              placeholder="Nom*"
              className={classes.form}
            />
            <TextField
              variant="outlined"
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
              variant="outlined"
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
            <TextField
              variant="outlined"
              required
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
              placeholder="Confirmer le mot de passe*"
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

export default Login;
