import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  makeStyles,
  Divider,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const DeleteFile = ({
  data,
  contractid,
  setSuccess,
  setError,
  getOneContract,
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { setLoading, authAxios, setCount } = useContext(UserContext);
  const [doc, setDoc] = useState("");

  const deleteFile = async (dt) => {
    setError("");
    setSuccess("");
    setOpen(!open);
    setLoading(true);
    try {
      await authAxios.put(`/contracts/delete/file/${contractid}`, {
        file: dt,
      });
      setCount((count) => count + 1);
      setLoading(false);
      setSuccess("Document supprimé avec succès");
      getOneContract(contractid);
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Tooltip title="Supprimer">
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Supprimer un document</DialogTitle>
        <Divider />
        <DialogContent>
          Êtez-vous sûr de vouloir supprimer le document <br />
          <strong>{data}</strong> du contrat ? <br />
          Une fois validé, il n'est plus possible de revenir en arrière.
        </DialogContent>
        <Divider />
        <Box className={classes.box}>
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            Retour
          </Button>

          <Button
            onClick={() => deleteFile(data)}
            color="primary"
            className={classes.button}
          >
            Valider
          </Button>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default DeleteFile;
