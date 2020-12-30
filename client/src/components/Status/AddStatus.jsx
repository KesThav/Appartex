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
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

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

const AddStatus = ({ setSuccess }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { setCount, setLoading, authAxios, loading } = useContext(UserContext);
  const [err, setError] = useState("");
  const [name, setName] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
        setOpen(false);
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
        <DialogTitle>{"Créer un statut"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
          </div>
          <form onSubmit={submit} autoComplete="off">
            <TextField
              required
              id="name"
              variant="outlined"
              type="string"
              onChange={(e) => setName(e.target.value)}
              fullWidth
              placeholder="Nom du statut*"
              className={classes.form}
            />

            <Box className={classes.box2}>
              <Button
                className={classes.button}
                color="inherit"
                onClick={() => setOpen(!open)}
                disabled={loading}
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

export default AddStatus;
