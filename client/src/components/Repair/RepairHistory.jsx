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

const RepairHistory = ({ data }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [repairhistory, setRepairhistory] = useState("");

  const getRepairHistories = async (data) => {
    try {
      const res = await authAxios.get(`/history/repairs/${data}`);
      setRepairhistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRepairHistories(data);
  }, []);

  return (
    <Fragment>
      <Button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <HistoryIcon />
      </Button>

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
                      {moment(rp.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{rp.status.name}</TableCell>
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

export default RepairHistory;
