import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Box,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
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
});

const EditMessageStatus = ({ id, statustype, getMessages }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const { authAxios, user, setLoading, setCount } = useContext(UserContext);
  const [content, setContent] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState(statustype);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const data = {
      status,
    };
    try {
      const res = await authAxios.put(`/messages/update/status/${id}`, data);
      setSuccess("Statut modifié");
      setCount((count) => count + 1);
    } catch (err) {
      setLoading(false);
      console.log(err.response.data);
    }
  };

  const statut = [
    { value: "envoyé", label: "envoyé" },
    { value: "En cours", label: "En cours" },
    { value: "Tâche créé", label: "Tâche créé" },
    { value: "Terminé", label: "Terminé" },
  ];

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(!open);
        }}
      >
        Editer le statut
      </Button>
      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Envoyer un message"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit}>
            <TextField
              variant="outlined"
              id="Status"
              select
              value={status}
              label="Statut"
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              className={classes.form}
            >
              {statut.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
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

export default EditMessageStatus;
