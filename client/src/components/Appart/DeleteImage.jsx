import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  makeStyles,
  Divider,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const DeleteAppart = ({
  data,
  appartid,
  setSuccess,
  setError,
  getOneAppart,
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { setLoading, authAxios, setCount } = useContext(UserContext);
  const [doc, setDoc] = useState("");

  const deletePicture = async (dt) => {
    setError("");
    setSuccess("");
    setOpen(!open);
    setLoading(true);
    try {
      await authAxios.put(`/appartments/delete/file/${appartid}`, {
        picture: dt,
      });
      setCount((count) => count + 1);
      setLoading(false);
      setSuccess("Image supprimé avec succès");
      getOneAppart(appartid);
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
    }
  };

  const getAppart = async (tenantid) => {
    try {
      const res = await authAxios.get(`/appartments/${appartid}`);
      setDoc(res.data);
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    if (open == true) {
      getAppart(appartid);
    }
  }, [open]);

  return (
    <Fragment>
      <Tooltip title="Supprimer">
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>Supprimer une image</DialogTitle>
        <Divider />
        <DialogContent>
          Êtez-vous sûr de vouloir supprimer le document
          <strong>{data.name + " "}</strong> de l'appartement
          <strong>
            {doc.building
              ? " " +
                doc.building.adress +
                " " +
                doc.building.postalcode +
                " " +
                doc.building.city +
                ", " +
                doc.size +
                " pièces"
              : " " +
                doc.adress +
                " " +
                doc.postalcode +
                " " +
                doc.city +
                ", " +
                doc.size +
                " pièces"}
          </strong>
          ? <br />
          Une fois validé, il n'est plus possible de revenir en arrière.
        </DialogContent>
        <Divider />
        <Box className={classes.box}>
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            Retour
          </Button>

          <Button
            onClick={() => deletePicture(data._id)}
            color="primary"
            className={classes.button}
          >
            Valider
          </Button>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default DeleteAppart;
