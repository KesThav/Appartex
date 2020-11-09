import React, { useContext } from "react";
import { Button, makeStyles } from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";

const ArchiveMessage = ({ id, setSuccess, setError }) => {
  const { authAxios, setLoading, setCount } = useContext(UserContext);

  const submit = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authAxios.put(`/messages/archive/${id}`);
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
