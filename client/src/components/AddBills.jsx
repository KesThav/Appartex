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

const AddBills = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    bill,
    tenant,
    getTenants,
    setLoading,
    authAxios,
    getBills,
    getStatus,
    status,
    getBillHistories,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [tenantid, setTenantid] = useState("");
  const [statusid, setStatusid] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!statusid || !endDate || !tenantid || !reason || !amount) {
      setError("Complétez les champs obligatoires");
    } else {
      setLoading(true);
      const data = {
        endDate,
        reference,
        amount,
        tenant: tenantid,
        status: statusid,
        reason,
      };
      try {
        await authAxios.post("/bills/add", data);
        setLoading(false);
        setSuccess("Facture créé avec succès");
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
    setTenantid("");
    setStatusid("");
    setReason("");
    setReference("");
    setAmount("");
    setEndDate("");
  };

  useEffect(() => {
    getTenants();
    getStatus();
    getBills();
  }, []);

  return (
    <div>
      <Box className={classes.box}>
        <Button variant="contained" color="primary" onClick={OnOpen}>
          Ajouter
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Créer un Contrat"}</DialogTitle>
        <DialogContent>
          {err && <Alert severity="error">{err}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
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
                tenant.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name} {option.lastname}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              variant="outlined"
              id="Status"
              select
              value={statusid}
              label="Statut"
              onChange={(e) => setStatusid(e.target.value)}
              fullWidth
              className={classes.form}
            >
              {status &&
                status.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              id="reference"
              type="string"
              variant="outlined"
              onChange={(e) => setReference(e.target.value)}
              fullWidth
              placeholder="Réference"
              className={classes.form}
            />
            <TextField
              id="amount"
              variant="outlined"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              placeholder="Montant"
              className={classes.form}
            />

            <TextField
              id="reason"
              type="text"
              variant="outlined"
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              placeholder="Raison"
              className={classes.form}
            />

            <TextField
              id="reason"
              type="date"
              variant="outlined"
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              placeholder="Raison"
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

export default AddBills;
