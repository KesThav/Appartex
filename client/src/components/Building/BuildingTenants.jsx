import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TableRow,
  TableCell,
  Box,
  makeStyles,
  Divider,
  Tooltip,
  IconButton,
  Avatar,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const BuildingTenants = ({ data, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [doc, setDoc] = useState("");

  const getOneBuildingTenants = async (data) => {
    try {
      const res = await authAxios.get(`/buildings/tenants/${data}`);
      setDoc(res.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    if (open == true) {
      getOneBuildingTenants(data);
    }
  }, [open]);

  return (
    <Fragment>
      <Tooltip title="Détails">
        <IconButton
          onClick={() => {
            setDoc("");
            setOpen(true);
          }}
        >
          <PersonIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        disableBackdropClick
      >
        <DialogTitle>Liste des locataires</DialogTitle>
        <DialogContent>
          {doc.length > 0
            ? doc.map((doc, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Avatar />
                  </TableCell>
                  <TableCell>
                    {doc.name} {doc.lastname}
                  </TableCell>
                </TableRow>
              ))
            : "Pas de locataires"}
        </DialogContent>
        <Divider />
        <Box className={classes.box}>
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            Fermer
          </Button>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default BuildingTenants;
