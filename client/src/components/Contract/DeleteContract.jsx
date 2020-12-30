import React, { useState, useContext, Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  List,
  ListItem,
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

const DeleteContract = ({ data, setSuccess, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { setLoading, authAxios, setCount } = useContext(UserContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const DeleteContract = async (contractid) => {
    setOpen(!open);
    setLoading(true);
    try {
      await authAxios.delete(`contracts/delete/${contractid}`);
      setLoading(false);
      setCount((count) => count + 1);
      setSuccess("Contrat supprimé avec succès");
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
        <DialogTitle>Supprimer un contract</DialogTitle>
        <Divider />
        <DialogContent>
          Êtez-vous sûr de vouloir supprimer le contrat <br />
          <strong>{data._id}</strong> ? <br />
          Cette action entrainera : <br />
          <List>
            <ListItem>L'appartment lié au contract passera en libre</ListItem>
          </List>
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
            onClick={() => DeleteContract(data._id)}
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

export default DeleteContract;
