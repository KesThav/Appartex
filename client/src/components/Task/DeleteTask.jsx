import React, { useContext, Fragment, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Box,
  Button,
  makeStyles,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const DeleteTask = ({ id, setSuccess, setError }) => {
  const classes = useStyles();
  const { setLoading, setCount, authAxios } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const deleteTask = async (taskid) => {
    setOpen(!open);
    setLoading(true);
    try {
      await authAxios.delete(`/tasks/delete/${taskid}`);
      setLoading(false);
      setSuccess("Tâche supprimé avec succès");
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <IconButton>
        <DeleteIcon onClick={() => setOpen(!open)} />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Supprimer une tâche</DialogTitle>
        <Divider />
        <DialogContent>
          Êtez-vous sûr de vouloir supprimer la facture
          <br />
          <strong>{id}</strong> ? <br />
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
            onClick={() => deleteTask(id)}
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

export default DeleteTask;
