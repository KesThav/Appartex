import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../middlewares/ContextAPI";
import {
  makeStyles,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  InputAdornment,
  Typography,
  Fab,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import Alert from "@material-ui/lab/Alert";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    maxWidth: "100%",
  },
  box: {
    marginBottom: 20,
  },
  form: {
    marginBottom: 17,
  },
  box2: {
    display: "flex",
    flexDirection: "row-reverse",
  },
}));

const AddTenant = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { loading, setLoading, authAxios, tenant, getTenants } = useContext(
    UserContext
  );
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dateofbirth, setDate] = useState();
  const [count, setCount] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!dateofbirth) {
      setDate(moment().format("YYYY-MM-DD"));
    }
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
        dateofbirth,
        password,
      };
      try {
        await authAxios.post("/tenants/add", data);
        setLoading(false);
        setSuccess("Locataire créé avec succès");
        setCount((count) => count + 1);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const OnOpen = () => {
    setOpen(!open);
    setError("");
    setSuccess("");
    setName("");
    setLastname("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setDate();
  };

  useEffect(() => {
    getTenants();
  }, [count]);


  return (
    <div>
      <Box className={classes.box}>
        <Fab color="primary" onClick={OnOpen}>
          <Typography variant="h5">+</Typography>
        </Fab>
      </Box>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Créer un locataire"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit}>
            <TextField
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
            <TextField
              variant="outlined"
              id="date"
              type="date"
              defaultValue={moment().format("YYYY-MM-DD")}
              placeholder="Date de naissance"
              onChange={(e) => {
                setDate(moment(e.target.value).format("YYYY-MM-DD"));
              }}
              className={classes.form}
              InputLabelProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <Box className={classes.box2}>
              <Button
                className={classes.button}
                color="inherit"
                onClick={() => setOpen(!open)}
              >
                Retour
              </Button>

              <Button type="submit" color="primary" className={classes.button}>
                Valider
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTenant;
