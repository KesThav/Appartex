import React, {  useContext, } from "react";
import { Button, } from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";


const UnArchiveMessage = ({ id, setSuccess, setError }) => {

  const { authAxios, setLoading, setCount } = useContext(UserContext);

  const submit = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await authAxios.put(`/messages/unarchive/${id}`);
      setLoading(false);
      setSuccess("Message Désarchivé");
      setCount((count) => count + 1);
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };
  return (
    <div>
      <Button onClick={() => submit(id)}>Désarchiver</Button>
    </div>
  );
};

export default UnArchiveMessage;
