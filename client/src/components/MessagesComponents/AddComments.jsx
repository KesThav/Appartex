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
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
  button: {
    marginBottom: 30,
  },
  box: {
    marginBottom: 20,
  },
  form: {
    marginBottom: 17,
  },
  box2: {
    display: "flex",
    flexDirection: "row-reverse",
  },
});

const AddComments = ({ id, getMessages }) => {
  const classes = useStyles();
  const [content, setContent] = useState();
  const [open, setOpen] = useState(false);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { authAxios } = useContext(UserContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getMessages();
  }, [count]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!content) {
      setError("Le contenu ne peut pas être vide");
    } else {
      const data = {
        content,
      };
      try {
        const res = await authAxios.post(`/messages/comment/add/${id}`, data);
        setSuccess("Message envoyé");
        setCount((count) => count + 1);
      } catch (err) {
        setError(err.response.data);
      }
    }
  };
  return (
    <div>
      <Button
        aria-label="add to favorites"
        onClick={() => {
          setOpen(!open);
        }}
      >
        Répondre
      </Button>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Ajouter un commentaire"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <form onSubmit={submit}>
            <TextField
              id="amount"
              variant="outlined"
              type="text"
              multiline
              rows={2}
              rowsMax={4}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              placeholder="Message"
              className={classes.form}
            />
            <Box className={classes.box2}>
              <Button
                className={classes.button}
                color="inherit"
                onClick={() => setOpen(!open)}
              >
                Retour
              </Button>

              <Button type="submit" color="primary" className={classes.button}>
                Valider
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddComments;
