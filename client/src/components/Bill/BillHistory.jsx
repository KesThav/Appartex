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
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const BillHistory = ({ data, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [billhistory, setBillhistory] = useState("");
  const [doc, setDoc] = useState("");

  const getBillHistories = async (data) => {
    try {
      const res = await authAxios.get(`/history/bills/${data}`);
      setBillhistory(res.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  const getOneBill = async (data) => {
    try {
      const res = await authAxios.get(`/bills/${data}`);
      setDoc(res.data.file);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    getBillHistories(data);
    getOneBill(data);
  }, []);

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
        <DialogTitle>Historique de la facture</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>date de fin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billhistory &&
                billhistory.map((bh) => (
                  <TableRow key={bh._id}>
                    <TableCell>
                      {moment(bh.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>{bh.status.name}</TableCell>
                    <TableCell>
                      {bh.endDate
                        ? moment(bh.endDate).format("YYYY-MM-DD")
                        : "-"}
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
                <TableCell>
                  <Link to={`//localhost:5000/${doc}`} target="_blank">
                    {doc}
                  </Link>
                </TableCell>
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

export default BillHistory;
