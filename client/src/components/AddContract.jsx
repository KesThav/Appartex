import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../middlewares/ContextAPI";
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
    setLoading,
    authAxios,
    appart,
    getApparts,
    tenant,
    getTenants,
    contract,
    getContracts,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [charge, setCharge] = useState(null);
  const [tenantid, setTenantid] = useState(null);
  const [appartid, setAppartid] = useState(null);
  const [rent, setRent] = useState("");
  const [other, setOther] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!charge || !rent || !tenantid || !appartid) {
      setError("Complétez tous les champs");
    } else {
      setLoading(true);
      const data = {
        charge,
        rent,
        other,
        tenant: tenantid,
        appartmentid: appartid,
      };
      try {
        await authAxios.post("/contracts/add", data);
        setLoading(false);
        setSuccess("Contrat créé avec succès");
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
    setOther("");
    setRent("");
    setCharge("");
    setTenantid("");
    setAppartid("");
  };

  useEffect(() => {
    getTenants();
    getApparts();
    getContracts();
  }, []);

  return (
    <div>
      <Box className={classes.box}>
        <Fab variant="contained" color="primary" onClick={OnOpen}>
          <Typography variant="h5">+</Typography>
        </Fab>
      </Box>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Créer un Contrat"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit}>
            <TextField
              variant="outlined"
              id="Tenant"
              select
              value={tenantid}
              label="Locataire"
              onChange={(e) => setTenantid(e.target.value)}
              fullWidth
              className={classes.form}
            >
              {tenant &&
                tenant
                  .filter((option) => option.status == "Actif")
                  .map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name} {option.lastname}
                    </MenuItem>
                  ))}
            </TextField>
            <TextField
              variant="outlined"
              id="Appartment"
              select
              value={appartid}
              label="Appartement"
              onChange={(e) => setAppartid(e.target.value)}
              fullWidth
              className={classes.form}
            >
              {appart &&
                appart
                  .filter((option) => option.status == "Libre")
                  .map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {!option.building
                        ? option.adress +
                          " " +
                          option.postalcode +
                          " " +
                          option.city
                        : option.building.adress +
                          " " +
                          option.building.postalcode +
                          " " +
                          option.building.city}
                    </MenuItem>
                  ))}
            </TextField>
            <TextField
              id="rent"
              type="number"
              variant="outlined"
              onChange={(e) => setRent(e.target.value)}
              fullWidth
              placeholder="Loyer"
              className={classes.form}
            />
            <TextField
              id="codepostal"
              variant="outlined"
              type="number"
              onChange={(e) => setCharge(e.target.value)}
              fullWidth
              placeholder="Charge"
              className={classes.form}
            />

            <TextField
              id="other"
              type="text"
              variant="outlined"
              onChange={(e) => setOther(e.target.value)}
              fullWidth
              placeholder="Autre"
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

export default AddAppart;
