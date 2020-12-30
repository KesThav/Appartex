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
  IconButton,
  Tooltip,
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

const DeleteBuilding = ({ data, setSuccess, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { setLoading, setCount, authAxios } = useContext(UserContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const DeleteBuilding = async (buildingid) => {
    setOpen(!open);
    setLoading(true);
    try {
      await authAxios.delete(`buildings/delete/${buildingid}`);
      setLoading(false);
      setSuccess("Immeuble supprimé avec succès");
      setCount((count) => count + 1);
    } catch (err) {
      setOpen(!open);
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
        <DialogTitle>Supprimer un immeuble</DialogTitle>
        <Divider />
        <DialogContent>
          Êtez-vous sûr de vouloir supprimer l'immeuble se trouvant à <br />
          <strong>
            {data.adress} {data.postalcode} {data.city}
          </strong>{" "}
          ? <br />
          Cette action entrainera : <br />
          <List>
            <ListItem>
              la suppression de tous les appartements liés à l'immeuble
            </ListItem>
            <ListItem>
              le suppression de tous les contrats liés à l'immeuble
            </ListItem>
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
            onClick={() => DeleteBuilding(data._id)}
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

export default DeleteBuilding;
