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
import { BillHistoryToExcel } from "../../pages/ownerpages/export";
import { arrayBufferToBase64 } from "../arrayBufferToBase64";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

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
  const { authAxios, count } = useContext(UserContext);
  const [billhistory, setBillhistory] = useState("");
  const [doc, setDoc] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
      const doc =
        res &&
        res.data.file.map((data) => {
          return {
            data:
              `data:${data.contentType};base64,` +
              arrayBufferToBase64(data.data.data),
            name: data.name,
            _id: data._id,
          };
        });
      setDoc(doc);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    if (open == true) {
      getBillHistories(data);
      getOneBill(data);
    }
  }, [open]);

  return (
    <Fragment>
      <Tooltip title="Détails">
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
        >
          <HistoryIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        disableBackdropClick
        fullScreen={fullScreen}
      >
        <DialogTitle>Historique de la facture</DialogTitle>

        <DialogContent>
          {billhistory && <BillHistoryToExcel billHistory={billhistory} />}
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
                      {moment(bh.createdAt).format("DD/MM/YY")}
                    </TableCell>
                    <TableCell>
                      {bh.status ? bh.status.name : "état supprimé"}
                    </TableCell>
                    <TableCell>
                      {bh.endDate ? moment(bh.endDate).format("DD/MM/YY") : "-"}
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
                  <a href={doc.data} download={doc.name}>
                    {doc.name}
                  </a>
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

export default BillHistory;
