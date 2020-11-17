import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TableCell,
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

const ContractDoc = ({ data }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [doc, setDoc] = useState("");

  const getOneContract = async (data) => {
    try {
      const res = await authAxios.get(`/contracts/${data}`);
      setDoc(res.data.file);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOneContract(data);
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

export default ContractDoc;
