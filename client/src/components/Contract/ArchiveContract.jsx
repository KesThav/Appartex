import React, { useState, useContext, Fragment } from "react";
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
import ArchiveIcon from "@material-ui/icons/Archive";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const ArchiveContract = ({ data, setSuccess, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { setLoading, authAxios, setCount } = useContext(UserContext);

  const archive = async (data) => {
    setOpen(!open);
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authAxios.put(`/contracts/archive/${data}`);
      setLoading(false);
      setCount((count) => count + 1);
      setSuccess("Contrat archivé avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  return (
    <Fragment>
      <Tooltip title="Archiver">
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ArchiveIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Supprimer un contract</DialogTitle>
        <Divider />
        <DialogContent>
          {" "}
          <DialogContent>
            Êtez-vous sûr de vouloir archiver le contract <br />
            <strong>{data._id}</strong> ? <br />
            Une fois validé, il n'est plus possible de revenir en arrière.
          </DialogContent>
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
            onClick={() => archive(data._id)}
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

export default ArchiveContract;
