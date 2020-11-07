import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  makeStyles,
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

const ArchiveMessage = ({ id, getMessages }) => {
  const classes = useStyles();
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { authAxios, setLoading } = useContext(UserContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getMessages();
  }, [count]);

  const submit = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await authAxios.put(`/messages/archive/${id}`);
      setLoading(false);
      setSuccess("Message Archivé");
      setCount((count) => count + 1);
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };
  return (
    <div>
      <Button onClick={() => submit(id)}>Archiver</Button>
    </div>
  );
};

export default ArchiveMessage;
