import React, { useState, useContext, Fragment } from "react";
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
  Tooltip,
  IconButton,
} from "@material-ui/core";
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

const EditTaks = ({ appointmentData, setSuccess, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyle();
  const [statusid, setStatusid] = useState(appointmentData.status._id);
  const [messageid, setMessageid] = useState(
    appointmentData.messageid ? appointmentData.messageid._id : ""
  );
  const [startDate, setStartDate] = useState(
    moment(appointmentData.startDate).format("YYYY-MM-DDTHH:MM")
  );
  const [endDate, setEndDate] = useState(
    moment(appointmentData.endDate).format("YYYY-MM-DDTHH:MM")
  );
  const [title, setTitle] = useState(appointmentData.title);
  const [content, setContent] = useState(appointmentData.content);
  const [taskid, setTaskid] = useState(appointmentData._id);
  const { authAxios, status, setCount } = useContext(UserContext);

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
      const data = {
        startDate,
        endDate,
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
    <Fragment>
      <Tooltip title="Editer">
        <IconButton>
          <EditIcon
            onClick={() => {
              setOpen(!open);
            }}
          />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Editer une tâche</DialogTitle>
        <DialogContent>
          <form onSubmit={submit} autoComplete="off">
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
              helperText="Sélectionnez un statut*"
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              placeholder="Date de début*"
              className={classes.form}
            />
            <TextField
              required
              id="date de fin"
              type="datetime-local"
              variant="outlined"
              label="Date de fin"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              fullWidth
              placeholder="Date de fin*"
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
    </Fragment>
  );
};

export default EditTaks;
