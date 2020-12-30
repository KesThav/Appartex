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
} from "@material-ui/core";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
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

const AddBills = ({ setSuccess }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    tenant,
    getTenants,
    setLoading,
    authAxios,
    getStatus,
    status,
    count,
    loading,
    setCount,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [tenantid, setTenantid] = useState("");
  const [statusid, setStatusid] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!endDate) {
      setEndDate(moment().format("YYYY-MM-DD"));
    } else if (moment(endDate).diff(moment(), "days") < 0) {
      setError("La date ne peut pas être dans le passé");
    } else if (!statusid || !endDate || !tenantid || !reason || !amount) {
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
        setOpen(false);
        setSuccess("Facture créé avec succès");
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
    setTenantid("");
    setStatusid("");
    setReason("");
    setReference("");
    setAmount("");
    setEndDate("");
  };

  useEffect(() => {
    if (open == true) {
      getTenants();
      getStatus();
    }
  }, [count, open]);

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
        <DialogTitle>{"Créer une facture"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
          </div>
          {tenant && tenant.length == 0 && (
            <Alert severity="info">
              Aucun locataire trouvé. Merci de créer un ou des locataires avant
              de créer une facture
            </Alert>
          )}
          <br />
          {status && status.length == 0 && (
            <Alert severity="info">
              Aucun état trouvé. Merci de créer un ou des états avant de créer
              une facture
            </Alert>
          )}
          <br />
          <form onSubmit={submit} autoComplete="off">
            <TextField
              required
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
              required
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
              placeholder="Référence"
              className={classes.form}
            />
            <TextField
              inputProps={{
                step: 0.05,
              }}
              required
              id="amount"
              variant="outlined"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              placeholder="Montant*"
              className={classes.form}
            />

            <TextField
              required
              id="reason"
              type="text"
              variant="outlined"
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              placeholder="Raison*"
              className={classes.form}
            />

            <TextField
              required
              id="date"
              type="date"
              variant="outlined"
              defaultValue={moment().format("YYYY-MM-DD")}
              onChange={(e) =>
                setEndDate(moment(e.target.value).format("YYYY-MM-DD"))
              }
              fullWidth
              placeholder="Date"
              helperText="Sélectionnez une date*"
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

export default AddBills;
