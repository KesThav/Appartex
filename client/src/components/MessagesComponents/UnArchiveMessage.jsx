import React, { useState, useContext } from "react";
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

const DeleteMessage = ({ id }) => {
  const classes = useStyles();
  const [content, setContent] = useState();
  const [open, setOpen] = useState(false);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { authAxios, user, setLoading } = useContext(UserContext);

  const submit = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await authAxios.put(`/messages/unarchive/${id}`);
      setLoading(false);
      setSuccess("Message supprimé");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };
  return (
    <div>
      <Button aria-label="add to favorites" onClick={() => submit(id)}>
        Désarchiver
      </Button>
    </div>
  );
};

export default DeleteMessage;
