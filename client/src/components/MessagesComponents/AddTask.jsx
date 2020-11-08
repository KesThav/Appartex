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
  const { setLoading, authAxios, status, getStatus, loading } = useContext(
    UserContext
  );
  const [err, setError] = useState("");
  const [statusid, setStatusid] = useState("");
  const [success, setSuccess] = useState("");
  const [messageid, setMessageid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [count, setCount] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!startDate || !endDate || !messageid || !title || !content) {
      setError("Complétez tous les champs");
    } else if (startDate > endDate) {
      setError("jfggh");
    } else {
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
        setSuccess("Task créé avec succès");
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
    getStatus();
  }, [count]);

  return (
    <div>
      <Button onClick={() => OnOpen()}>Créer une tâche</Button>
      {loading && <LoadingScreen />}
      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Créer une tâche</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit}>
            <TextField
              id="messageid"
              type="string"
              variant="outlined"
              value={messageid}
              fullWidth
              disabled
              placeholder="messageid"
              className={classes.form}
            />
            <TextField
              id="title"
              variant="outlined"
              type="string"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              fullWidth
              placeholder="Titre"
              className={classes.form}
            />

            <TextField
              id="content"
              type="text"
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              placeholder="Description"
              className={classes.form}
            />
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
              id="date du début"
              type="datetime-local"
              variant="outlined"
              defaultValue={moment().format("YYYY-MM-DDTHH:MM")}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              placeholder="Description"
              className={classes.form}
            />
            <TextField
              id="date de fin"
              type="datetime-local"
              variant="outlined"
              defaultValue={moment().format("YYYY-MM-DDTHH:MM")}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              fullWidth
              placeholder="Description"
              className={classes.form}
            />

            <Box className={classes.box2}>
              <Button
                className={classes.button}
                color="inherit"
                onClick={() => {
                  setOpen(!open);
                  setMessageid("");
                }}
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

export default AddTask;
