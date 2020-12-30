import React, { useState, useContext, Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  makeStyles,
  Divider,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import DeleteIcon from "@material-ui/icons/Delete";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const DeleteStatus = ({ data, setSuccess, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { setLoading, authAxios, setCount } = useContext(UserContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const DeleteStatus = async (statusid) => {
    setSuccess("");
    setError("");
    setOpen(!open);
    setLoading(true);
    try {
      await authAxios.delete(`status/delete/${statusid}`);
      setLoading(false);
      setSuccess("Statut supprimé avec succès");
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
    }
  };

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

      <Dialog
        open={open}
        onClose={() => setOpen(!open)}
        disableBackdropClick
        fullScreen={fullScreen}
      >
        <DialogTitle>Supprimer un appartement</DialogTitle>
        <Divider />
        <DialogContent>
          {" "}
          <DialogContent>
            Êtez-vous sûr de vouloir supprimer le statut <br />
            <strong>{data.name}</strong> ? <br />
            Une fois validé, il n'est plus possible de revenir en arrière.
          </DialogContent>
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
            onClick={() => DeleteStatus(data._id)}
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

export default DeleteStatus;
