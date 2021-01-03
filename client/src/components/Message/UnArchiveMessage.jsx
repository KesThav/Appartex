import React, { useContext } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import UnarchiveOutlinedIcon from "@material-ui/icons/UnarchiveOutlined";

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
      <Tooltip title="Désarchiver">
        <IconButton onClick={() => submit(id)}>
          <UnarchiveOutlinedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default UnArchiveMessage;
