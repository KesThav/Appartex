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
import { RepairHistoryToExcel } from "../export";
import { arrayBufferToBase64 } from "../arrayBufferToBase64";
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
      "&:nth-child(even)": {
        backgroundColor: "#eceff1",
      },
      display: "block",
      width: "100%",
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

const RepairHistory = ({ data, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [repairhistory, setRepairhistory] = useState("");
  const [doc, setDoc] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

      <Dialog
        open={open}
        onClose={() => setOpen(!open)}
        disableBackdropClick
        fullScreen={fullScreen}
      >
        <DialogTitle>Détail de la réparation</DialogTitle>
        <Divider />
        <DialogContent>
          {repairhistory && (
            <RepairHistoryToExcel repairHistory={repairhistory} />
          )}
          <Table>
            <TableHead className={classes.thead}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tbody}>
              {repairhistory &&
                repairhistory.map((rp) => (
                  <TableRow key={rp._id} className={classes.trow}>
                    <TableCell className={classes.tcell} data-label="Date">
                      {moment(rp.createdAt).format("DD/MM/YY")}
                    </TableCell>
                    <TableCell className={classes.tcell} data-label="Statut">
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

export default RepairHistory;
