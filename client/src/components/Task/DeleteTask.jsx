import React, { useContext } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button } from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";

const DeleteTask = ({ id, setSuccess, setError }) => {
  const { setLoading, setCount, authAxios } = useContext(UserContext);

  const deleteTask = async (taskid) => {
    setLoading(true);
    try {
      await authAxios.delete(`/tasks/delete/${taskid}`);
      setLoading(false);
      setSuccess("Tâche supprimé avec succès");
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
    }
  };

  return (
    <div>
      <Button>
        <DeleteIcon onClick={() => deleteTask(id)} />
      </Button>
    </div>
  );
};

export default DeleteTask;
