import React, { useState, useContext } from "react";
import {
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import Alert from "@material-ui/lab/Alert";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

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

const EditMessageStatus = ({ id, statustype }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { authAxios, setLoading, setCount } = useContext(UserContext);
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
      setError(err.response.data);
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
      <Tooltip title="Editer le statut">
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
        >
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Editer un statut"}</DialogTitle>
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
