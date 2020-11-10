import React, { useState, useContext } from "react";
import {
  IconButton,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  List,
  ListItem,
  Tooltip,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const useStyles = makeStyles({
  box: {
    width: "100%",
    display: "flex",
    flexDirection: "row-reverse",
  },
});

const DeleteMessage = ({ id, setSuccess, setError }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { authAxios, setLoading, setCount } = useContext(UserContext);

  const submit = async (id) => {
    setOpen(!open);
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authAxios.delete(`/messages/delete/${id}`);

      setLoading(false);
      setSuccess("Message supprimé");
      setCount((count) => count + 1);
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };
  return (
    <div>
      <IconButton
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Tooltip title="Supprimer">
          <DeleteOutlinedIcon />
        </Tooltip>
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Supprimer un message</DialogTitle>
        <DialogContent>
          {" "}
          <DialogContent>
            Êtez-vous sûr de vouloir supprimer le message <br />
            <strong>{id}</strong> ? <br />
            Cette action entrainera : <br />
            <List>
              <ListItem>
                La suppression du message et de ses commentaires.
              </ListItem>
            </List>
            <strong>
              Archivez le message si vous voulez garder une trace.
            </strong>
            <br />
            Une fois validé, il n'est plus possible de revenir en arrière.
          </DialogContent>
        </DialogContent>
        <Box className={classes.box}>
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            Retour
          </Button>

          <Button
            onClick={() => submit(id)}
            color="primary"
            className={classes.button}
          >
            Valider
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default DeleteMessage;
