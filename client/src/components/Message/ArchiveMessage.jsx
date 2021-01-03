import React, { useContext } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import ArchiveOutlinedIcon from "@material-ui/icons/ArchiveOutlined";

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
      <Tooltip title="Archiver">
        <IconButton onClick={() => submit(id)}>
          <ArchiveOutlinedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ArchiveMessage;
