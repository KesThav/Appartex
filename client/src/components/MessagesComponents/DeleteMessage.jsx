import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Box,
  List,
  ListItem,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
  box: {
    width: "100%",
    display: "flex",
    flexDirection: "row-reverse",
  },
});

const DeleteMessage = ({ id, getMessages }) => {
  const classes = useStyles();
  const [content, setContent] = useState();
  const [open, setOpen] = useState(false);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { authAxios, user, setLoading } = useContext(UserContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getMessages();
  }, [count]);

  const submit = async (id) => {
    setOpen(!open);
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await authAxios.delete(`/messages/delete/${id}`);
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
      <Button
        aria-label="add to favorites"
        onClick={() => {
          console.log(id);
          setOpen(!open);
        }}
      >
        Supprimer
      </Button>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Supprimer un contrat</DialogTitle>
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
