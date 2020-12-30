import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import {
  makeStyles,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import Alert from "@material-ui/lab/Alert";
import moment from "moment";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

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

const AddTenant = ({ setSuccess }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { setLoading, authAxios, loading, setCount } = useContext(UserContext);
  const [err, setError] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dateofbirth, setDate] = useState();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    } else if (moment().diff(moment(dateofbirth), "years") < 18) {
      setError(
        "Le locataire ne peut pas être créé par la personne n'est pas majeur"
      );
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
        setOpen(false);
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

  return (
    <div>
      <Box className={classes.box}>
        <Button color="primary" variant="contained" onClick={() => OnOpen()}>
          Ajouter
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(!open)}
        disableBackdropClick
        fullScreen={fullScreen}
      >
        <DialogTitle>{"Créer un locataire"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
          </div>
          <form onSubmit={submit} autoComplete="off">
            <TextField
              required
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
              placeholder="Prénom*"
              className={classes.form}
            />
            <TextField
              required
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
              placeholder="Nom*"
              className={classes.form}
            />
            <TextField
              required
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
              placeholder="Email*"
              className={classes.form}
            />
            <TextField
              required
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
              placeholder="Mot de passe*"
              className={classes.form}
            />
            <TextField
              required
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
              placeholder="Confirmer le mot de passe*"
              className={classes.form}
            />
            <TextField
              required
              variant="outlined"
              id="date"
              type="date"
              defaultValue={moment().format("YYYY-MM-DD")}
              placeholder="Date de naissance*"
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
              helperText="Sélectionner la date de naissance"
            />
            <Box className={classes.box2}>
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
    </div>
  );
};

export default AddTenant;
