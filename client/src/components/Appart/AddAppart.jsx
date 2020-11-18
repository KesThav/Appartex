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
  MenuItem,
  Typography,
  Fab,
  Tooltip,
} from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";

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

const AddAppart = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    building,
    setLoading,
    authAxios,
    getBuildings,
    count,
    setCount,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adress, setAdress] = useState(null);
  const [postalcode, setPostalcode] = useState(null);
  const [city, setCity] = useState(null);
  const [size, setSize] = useState("");
  const [build, setBuild] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if ((!adress || !postalcode || !city) && !build) {
      setError(
        "L'adresse et l'immeuble ne peuvent pas être vide en même temps"
      );
    } else if ((adress || postalcode || city) && build) {
      setError(
        "L'adresse et l'immeuble ne peuvent pas être rempli en même temps"
      );
    } else if (!size) {
      setError("La taille ne peut pas être vide");
    } else {
      setLoading(true);
      const data = {
        adress,
        postalcode,
        city,
        size,
        building: build,
      };
      try {
        await authAxios.post("/appartments/add", data);
        setLoading(false);
        setSuccess("Appartement créé avec succès");
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
    setBuild("");
    setSize("");
  };

  useEffect(() => {
    getBuildings();
  }, [count]);

  return (
    <div>
      <Box className={classes.box}>
        <Tooltip title="Créer un appartement">
          <Fab color="primary" onClick={OnOpen}>
            <Typography variant="h5">+</Typography>
          </Fab>
        </Tooltip>
      </Box>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Créer un Appartment"}</DialogTitle>

        <DialogContent>
          <Typography variant="caption">
            Une appartement peut soit être créé en renseignant une adresse
            (appartement solitaire) soit en choisissant un immeuble. Les deux ne
            peuvent pas être renseignés en même temps !
          </Typography>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit}>
            <TextField
              id="adress"
              type="text"
              variant="outlined"
              onChange={(e) => setAdress(e.target.value)}
              fullWidth
              placeholder="Adresse"
              className={classes.form}
            />
            <TextField
              id="codepostal"
              variant="outlined"
              type="number"
              onChange={(e) => setPostalcode(e.target.value)}
              fullWidth
              placeholder="Code postal"
              className={classes.form}
            />
            <TextField
              id="city"
              type="text"
              variant="outlined"
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              placeholder="Ville"
              className={classes.form}
            />
            <TextField
              id="size"
              type="number"
              variant="outlined"
              onChange={(e) => setSize(e.target.value)}
              fullWidth
              placeholder="taille"
              className={classes.form}
            />
            <TextField
              variant="outlined"
              id="building"
              select
              value={build}
              label="Immeuble"
              onChange={(e) => setBuild(e.target.value)}
              helperText="Selectionner un immeuble"
              fullWidth
            >
              {building &&
                building.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.adress} {option.postalcode} {option.city}
                  </MenuItem>
                ))}
            </TextField>
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

export default AddAppart;
