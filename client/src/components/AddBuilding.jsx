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

const AddBuilding = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    loading,
    setLoading,
    authAxios,
    building,
    setBuilding,
    getBuildings,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [numberofAppart, setNumberofAppart] = useState("");
  const [adress, setAdress] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [city, setCity] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!numberofAppart || !adress || !postalcode || !city) {
      setError("Complétez tous les champs");
    } else {
      setLoading(true);
      const data = {
        numberofAppart,
        adress,
        postalcode,
        city,
      };
      try {
        await authAxios.post("/buildings/add", data);
        setLoading(false);
        setSuccess("Immeuble créé avec succès");
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
    setNumberofAppart("");
    setPostalcode("");
    setCity("");
    setAdress("");
  };

  useEffect(() => {
    getBuildings();
  }, [building]);

  return (
    <div>
      <Box className={classes.box}>
        <Button variant="contained" color="primary" onClick={OnOpen}>
          Ajouter
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Créer un locataire"}</DialogTitle>
        <DialogContent>
          {err && <Alert severity="error">{err}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <form onSubmit={submit}>
            <TextField
              id="numberofAppart"
              type="number"
              onChange={(e) => setNumberofAppart(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Nombre d'appartment"
              className={classes.form}
            />
            <TextField
              id="adress"
              type="text"
              onChange={(e) => setAdress(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Adresse"
              className={classes.form}
            />
            <TextField
              id="codepostal"
              type="number"
              onChange={(e) => setPostalcode(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Code postal"
              className={classes.form}
            />
            <TextField
              id="city"
              type="text"
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Ville"
              className={classes.form}
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

export default AddBuilding;
