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

const DeleteBuilding = ({ data, setSuccess, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { setLoading, setCount, authAxios } = useContext(UserContext);

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
      setError(err);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <DeleteIcon />
      </Button>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
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
