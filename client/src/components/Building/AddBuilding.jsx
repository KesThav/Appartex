import React, { useState, useContext } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import {
  makeStyles,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import LoadingScreen from "../LoadingScreen";
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

const AddBuilding = ({ setSuccess }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { setLoading, authAxios, loading, setCount } = useContext(UserContext);
  const [err, setError] = useState("");
  const [adress, setAdress] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [city, setCity] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!adress || !postalcode || !city) {
      setError("Complétez tous les champs");
    } else {
      setLoading(true);
      const data = {
        adress,
        postalcode,
        city,
      };
      try {
        await authAxios.post("/buildings/add", data);
        setLoading(false);
        setOpen(false);
        setSuccess("Immeuble créé avec succès");
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
    setPostalcode("");
    setCity("");
    setAdress("");
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
        <DialogTitle>{"Créer un immeuble"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {loading && <LoadingScreen />}
          </div>
          <form onSubmit={submit} autoComplete="off">
            <TextField
              required
              id="adress"
              type="text"
              variant="outlined"
              onChange={(e) => setAdress(e.target.value)}
              fullWidth
              placeholder="Adresse*"
              className={classes.form}
            />
            <TextField
              required
              id="codepostal"
              variant="outlined"
              type="number"
              onChange={(e) => setPostalcode(e.target.value)}
              fullWidth
              placeholder="Code postal*"
              className={classes.form}
            />
            <TextField
              required
              id="city"
              type="text"
              variant="outlined"
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              placeholder="Ville*"
              className={classes.form}
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
                disabled={loading}
                className={classes.button}
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

export default AddBuilding;
