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
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import HistoryIcon from "@material-ui/icons/History";
import moment from "moment";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const RepairHistory = ({ data, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [repairhistory, setRepairhistory] = useState("");
  const [doc, setDoc] = useState("");

  const getRepairHistories = async (data) => {
    try {
      const res = await authAxios.get(`/history/repairs/${data}`);
      setRepairhistory(res.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  const getOneRepair = async (data) => {
    try {
      const res = await authAxios.get(`/repairs/${data}`);
      setDoc(res.data.file);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    if (open == true) {
      getRepairHistories(data);
      getOneRepair(data);
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
        <DialogTitle>Détail de la réparation</DialogTitle>
        <Divider />
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repairhistory &&
                repairhistory.map((rp) => (
                  <TableRow key={rp._id}>
                    <TableCell>
                      {moment(rp.createdAt).format("DD/MM/YY")}
                    </TableCell>
                    <TableCell>
                      {rp.status ? rp.status.name : "état supprimé"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
        {doc.length > 0 && (
          <Fragment>
            <DialogTitle>Les documents</DialogTitle>
            <DialogContent>
              {doc.map((doc) => (
                <TableRow>
                  <Link to={`//localhost:5000/${doc}`} target="_blank">
                    {doc}
                  </Link>
                </TableRow>
              ))}
            </DialogContent>
          </Fragment>
        )}
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

export default RepairHistory;
