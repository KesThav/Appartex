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

const DeleteTenant = ({ data, setSuccess, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { setLoading, setCount, authAxios } = useContext(UserContext);

  const DeleteTenant = async (tenantid) => {
    setOpen(!open);
    setLoading(true);
    try {
      await authAxios.delete(`tenants/delete/${tenantid}`);
      setLoading(false);
      setSuccess("Locataire supprimé avec succès");
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
          Êtez-vous sûr de vouloir supprimer le locataire{" "}
          <strong>
            {data.lastname} {data.name}
          </strong>{" "}
          ? <br />
          Cette action entrainera : <br />
          <List>
            <ListItem>la suppression du locataire</ListItem>
            <ListItem>
              la suppression de tous les contrats liés au locataire
            </ListItem>
            <ListItem>
              la suppression de toutes les factures liées au locataire
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
            onClick={() => DeleteTenant(data._id)}
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

export default DeleteTenant;
