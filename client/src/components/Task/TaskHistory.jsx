import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  makeStyles,
  Divider,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import HistoryIcon from "@material-ui/icons/History";
import moment from "moment";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const TaskHistory = ({ data, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [taskhistory, setTaskHistory] = useState("");

  const getTaskHistories = async (data) => {
    try {
      const res = await authAxios.get(`/history/tasks/${data}`);
      setTaskHistory(res.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    if (open == true) {
      getTaskHistories(data);
    }
  }, [open]);

  return (
    <Fragment>
      <Tooltip title="Détails">
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
        >
          <HistoryIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Détail de la tâche</DialogTitle>
        <Divider />
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Contenu</TableCell>
                <TableCell>Date de début</TableCell>
                <TableCell>Date de fin</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskhistory &&
                taskhistory.map((ts) => (
                  <TableRow key={ts._id}>
                    <TableCell>
                      {moment(ts.createdAt).format("DD/MM/YY")}
                    </TableCell>
                    <TableCell>{ts.title}</TableCell>
                    <TableCell>{ts.content}</TableCell>
                    <TableCell>
                      {moment(ts.startDate).format("DD/MM/YY HH:MM")}
                    </TableCell>
                    <TableCell>
                      {moment(ts.endDate).format("DD/MM/YY HH:MM")}
                    </TableCell>
                    <TableCell>
                      {ts.status ? ts.status.name : "état supprimé"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
        <Divider />
        <Box className={classes.box}>
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            Fermer
          </Button>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default TaskHistory;
