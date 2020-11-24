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
} from "@material-ui/core";
import moment from "moment";
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

const AddRepair = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    task,
    getTasks,
    setLoading,
    authAxios,
    getStatus,
    status,
    count,
    setCount,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reason, setReason] = useState(null);
  const [statusid, setStatusid] = useState(null);
  const [taskid, setTaskid] = useState("");
  const [amount, setAmount] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!statusid || !taskid || !reason || !amount) {
      setError("Complétez les champs obligatoires");
    } else {
      setLoading(true);
      const data = {
        amount,
        reason,
        taskid,
        status: statusid,
      };
      try {
        await authAxios.post("/repairs/add", data);
        setLoading(false);
        setSuccess("Réparation créé avec succès");
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
    setTaskid("");
    setStatusid("");
    setReason("");
    setAmount("");
  };

  useEffect(() => {
    if (open == true) {
      getTasks();
      getStatus();
    }
  }, [count, open]);

  return (
    <div>
      <Button color="primary" variant="contained" onClick={() => OnOpen()}>
        Enregistrer une facture de réparation
      </Button>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Créer une réparation"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit} autoComplete="off">
            <TextField
              required
              variant="outlined"
              id="Task"
              select
              value={taskid}
              label="Tâche"
              onChange={(e) => setTaskid(e.target.value)}
              fullWidth
              className={classes.form}
            >
              {task &&
                task.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.title} - {option.content}
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
              required
              id="amount"
              variant="outlined"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              inputProps={{
                step: 0.05,
              }}
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

export default AddRepair;
