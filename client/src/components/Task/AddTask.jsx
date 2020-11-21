import React, { useState, useContext, useEffect, Fragment } from "react";
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
  Tooltip,
} from "@material-ui/core";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import LoadingScreen from "../LoadingScreen";
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

const AddTask = ({ id }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    setLoading,
    authAxios,
    status,
    getStatus,
    loading,
    count,
    setCount,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [statusid, setStatusid] = useState("");
  const [success, setSuccess] = useState("");
  const [messageid, setMessageid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!startDate || !endDate || !title || !content) {
      setError("Complétez tous les champs");
    } else if (startDate > endDate) {
      setError(
        "La date de fin ne peut pas être plus petit que la date de début"
      );
    } else {
      {
        !messageid && setLoading(true);
      }
      const data = {
        startDate,
        endDate,
        messageid,
        title,
        content,
        status: statusid,
      };
      try {
        const res = await authAxios.post("/tasks/add", data);
        setLoading(false);
        setSuccess("Tâche créé avec succès");
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
    setTitle("");
    setContent("");
    setStartDate("");
    setEndDate("");
    setMessageid(id);
  };

  useEffect(() => {
    if (open == true) {
      getStatus();
    }
  }, [count, open]);

  return (
    <Fragment>
      <Button onClick={() => OnOpen()}>Créer une tâche</Button>
      {loading && <LoadingScreen />}
      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Créer une tâche</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit} autoComplete="off">
            {id && (
              <TextField
                required
                id="messageid"
                type="string"
                variant="outlined"
                value={messageid}
                fullWidth
                disabled
                placeholder="messageid*"
                className={classes.form}
              />
            )}
            <TextField
              required
              id="title"
              variant="outlined"
              type="string"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              fullWidth
              placeholder="Titre*"
              className={classes.form}
            />

            <TextField
              required
              id="content"
              type="text"
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              placeholder="Description*"
              className={classes.form}
            />
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
              id="date du début"
              type="datetime-local"
              variant="outlined"
              label="Date de début"
              defaultValue={moment().format("YYYY-MM-DDTHH:MM")}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              placeholder="Date de début"
              className={classes.form}
            />
            <TextField
              required
              id="date de fin"
              type="datetime-local"
              variant="outlined"
              label="Date de fin"
              defaultValue={moment().format("YYYY-MM-DDTHH:MM")}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              fullWidth
              placeholder="Date de fin"
              className={classes.form}
            />

            <Box className={classes.box2}>
              <Button
                disabled={loading}
                className={classes.button}
                color="inherit"
                onClick={() => {
                  setOpen(!open);
                  setMessageid("");
                }}
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
    </Fragment>
  );
};

export default AddTask;
