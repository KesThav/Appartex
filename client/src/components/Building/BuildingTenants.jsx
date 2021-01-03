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
  Hidden,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import PersonIcon from "@material-ui/icons/Person";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
  [theme.breakpoints.down("sm")]: {
    trow: {
      "&:nth-child(even)": {
        backgroundColor: "#eceff1",
      },
      display: "block",
      width: "100%",
    },
    tcell: {
      overflowWrap: "break-word",
      display: "block",
      width: "100%",
      textAlign: "center",
      position: "relative",
    },
  },
}));

const BuildingTenants = ({ data, setError }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios } = useContext(UserContext);
  const [doc, setDoc] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
        fullScreen={fullScreen}
      >
        <DialogTitle>Liste des locataires</DialogTitle>
        <DialogContent>
          {doc.length > 0
            ? doc.map((doc, i) => (
                <TableRow key={i} className={classes.trow}>
                  <Hidden only={["xs", "sm"]}>
                    <TableCell className={classes.tcell}>
                      <Avatar />
                    </TableCell>
                  </Hidden>

                  <TableCell className={classes.tcell}>
                    {doc.name} {doc.lastname}
                  </TableCell>
                </TableRow>
              ))
            : "Pas de locataires"}
        </DialogContent>
        <Divider />
        <Button
          className={classes.button}
          color="inherit"
          onClick={() => setOpen(!open)}
        >
          Fermer
        </Button>
      </Dialog>
    </Fragment>
  );
};

export default BuildingTenants;
