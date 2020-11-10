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

const AddBills = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { setCount, setLoading, authAxios } = useContext(UserContext);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name) {
      setError("Complétez le nom");
    } else {
      setLoading(true);
      const data = {
        name,
      };
      try {
        await authAxios.post("/status/add", data);
        setLoading(false);
        setSuccess("Status créé avec succès");
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
  };

  return (
    <div>
      <Box className={classes.box}>
        <Tooltip title="Créer un statut">
          <Fab color="primary" onClick={OnOpen}>
            <Typography variant="h5">+</Typography>
          </Fab>
        </Tooltip>
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
              id="name"
              variant="outlined"
              type="string"
              onChange={(e) => setName(e.target.value)}
              fullWidth
              placeholder="Nom du statut"
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
