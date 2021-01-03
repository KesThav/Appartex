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
import { TaskHistoryToExcel } from "../export";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
      justifyContent: "center",
    },
  },
  [theme.breakpoints.down("sm")]: {
    thead: { display: "none" },
    tbody: { display: "block", width: "100%" },
    trow: {
      display: "block",
      width: "100%",
      "&:nth-child(even)": {
        backgroundColor: "#eceff1",
      },
    },
    tcell: {
      overflowWrap: "break-word",
      display: "block",
      width: "100%",
      textAlign: "right",
      paddingLeft: "50%",
      position: "relative",
      "&::before": {
        content: "attr(data-label)",
        position: "absolute",
        left: 5,
        justifyContent: "center",
        fontWeight: "bold",
      },
    },
  },
}));

const TaskHistory = ({ data, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [taskhistory, setTaskHistory] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

      <Dialog
        open={open}
        onClose={() => setOpen(!open)}
        disableBackdropClick
        fullScreen={fullScreen}
      >
        <DialogTitle>Détail de la tâche</DialogTitle>
        <Divider />
        <DialogContent>
          {taskhistory && <TaskHistoryToExcel taskHistory={taskhistory} />}
          <Table>
            <TableHead className={classes.thead}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Contenu</TableCell>
                <TableCell>Date de début</TableCell>
                <TableCell>Date de fin</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tbody}>
              {taskhistory &&
                taskhistory.map((ts) => (
                  <TableRow key={ts._id} className={classes.trow}>
                    <TableCell className={classes.tcell} data-label="Date">
                      {moment(ts.createdAt).format("DD/MM/YY")}
                    </TableCell>
                    <TableCell className={classes.tcell} data-label="Titre">
                      {ts.title}
                    </TableCell>
                    <TableCell className={classes.tcell} data-label="Contenu">
                      {ts.content}
                    </TableCell>
                    <TableCell
                      className={classes.tcell}
                      data-label="Date de début"
                    >
                      {moment(ts.startDate).format("DD/MM/YY HH:MM")}
                    </TableCell>
                    <TableCell
                      className={classes.tcell}
                      data-label="Date de fin"
                    >
                      {moment(ts.endDate).format("DD/MM/YY HH:MM")}
                    </TableCell>
                    <TableCell className={classes.tcell} data-label="Statut">
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
