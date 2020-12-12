import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TableRow,
  TableCell,
  Box,
  makeStyles,
  Divider,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import HistoryIcon from "@material-ui/icons/History";
import { arrayBufferToBase64 } from "../arrayBufferToBase64";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const ContractDoc = ({ data, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [doc, setDoc] = useState("");

  const getOneContract = async (data) => {
    try {
      const res = await authAxios.get(`/contracts/${data}`);
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
      getOneContract(data);
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

export default ContractDoc;
