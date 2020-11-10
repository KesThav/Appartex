import React, { useState, useContext, Fragment } from "react";
import { IconButton, makeStyles, TextField, Avatar } from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles({
  form: {
    marginTop: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    marginRight: 6,
  },
  icon: {
    color: "#bdbdbd",
  },
});

const AddComments = ({ id, setError, setSuccess }) => {
  const classes = useStyles();
  const [content, setContent] = useState();
  const [open, setOpen] = useState(false);
  const { authAxios, setCount } = useContext(UserContext);

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
        setContent("");
        setCount((count) => count + 1);
      } catch (err) {
        setError(err.response.data);
      }
    }
  };
  return (
    <Fragment>
      <form onSubmit={submit} className={classes.form}>
        <Avatar className={classes.avatar} />
        <TextField
          id="amount"
          variant="outlined"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Message"
          fullWidth
          className={classes.form}
        />
        <IconButton type="submit">
          <SendIcon fontSize="large" className={classes.icon} />
        </IconButton>
      </form>
    </Fragment>
  );
};

export default AddComments;
