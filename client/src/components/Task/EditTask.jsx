import React, { useState, useContext } from "react";
import EditIcon from "@material-ui/icons/Edit";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  TextField,
  MenuItem,
  Box,
  Button,
  makeStyles,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import moment from "moment";
import { UserContext } from "../../middlewares/ContextAPI";

const useStyle = makeStyles({
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
});

const EditTaks = ({
  appointmentData,
  setVisible,
  visible,
  setSuccess,
  setError,
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyle();
  const [statusid, setStatusid] = useState(appointmentData.status._id);
  const [messageid, setMessageid] = useState(appointmentData.messageid._id);
  const [startDate, setStartDate] = useState(
    moment(appointmentData.startDate).format("YYYY-MM-DDTHH:MM")
  );
  const [endDate, setEndDate] = useState(
    moment(appointmentData.endDate).format("YYYY-MM-DDTHH:MM")
  );
  const [title, setTitle] = useState(appointmentData.title);
  const [content, setContent] = useState(appointmentData.content);
  const [taskid, setTaskid] = useState(appointmentData._id);
  const { authAxios, status, setCount, setLoading } = useContext(UserContext);

  const submit = async (e) => {
    e.preventDefault();
    /* setVisible(!visible); */
    setError("");
    setSuccess("");
    if (!startDate || !endDate || !messageid || !title || !content) {
      setError("Complétez tous les champs");
    } else if (startDate > endDate) {
      setError(
        "La date de fin ne peut pas être plus petit que la date de début"
      );
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
        const res = await authAxios.put(`/tasks/update/${taskid}`, data);
        setSuccess("Tâche modifié avec succès");
        setCount((count) => count + 1);
      } catch (err) {
        setError(err.response.data);
      }
    }
  };

  return (
    <div>
      <Button>
        <EditIcon
          onClick={() => {
            setOpen(!open);
          }}
        />
      </Button>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Editer une tâche</DialogTitle>
        <DialogContent>
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
              label="Date de début"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              placeholder="Description"
              className={classes.form}
            />
            <TextField
              id="date de fin"
              type="datetime-local"
              variant="outlined"
              label="Date de fin"
              value={endDate}
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

export default EditTaks;
