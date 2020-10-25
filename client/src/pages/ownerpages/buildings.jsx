import React, { useState, useContext, useEffect, Fragment } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  makeStyles,
  Dialog,
  DialogContent,
  Box,
  TextField,
  DialogTitle,
  List,
  ListItem,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddBuilding from "../../components/AddBuilding";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    height: "60vh",
    overflowY: "scroll",
  },
  header: {
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
  },
  box: {
    width: "100%",
    display: "flex",
    flexDirection: "row-reverse",
  },
  box2: {
    display: "flex",
    flexDirection: "row-reverse",
  },
  form: {
    marginBottom: 17,
  },
}));
const Building = () => {
  const {
    building,
    setBuilding,
    getBuildings,
    setLoading,
    authAxios,
  } = useContext(UserContext);
  const [deleteShow, setDeleteShow] = useState(false);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [numberofAppart, setNumberofAppart] = useState("");
  const [adress, setAdress] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [city, setCity] = useState("");
  const [editing, setEditing] = useState(false);

  const classes = useStyles();
  useEffect(() => {
    getBuildings();
  }, []);

  const DeleteBuilding = (buildingid) => {
    setLoading(true);
    try {
      authAxios.delete(`buildings/delete/${buildingid}`);
      setLoading(false);
      setDeleteShow(!deleteShow);
    } catch (err) {
      setDeleteShow(!deleteShow);
      console.log(err);
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const updatedata = {
      numberofAppart,
      city,
      adress,
      postalcode,
    };
    try {
      await authAxios.put(`/buildings/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setSuccess("Immeuble modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const statut = [
    { value: "Actif", label: "Actif" },
    { value: "Inactif", label: "Inactif" },
  ];

  return (
    <div>
      <AddBuilding />
      {err && <Alert severity="error">{err}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TableContainer className={classes.table}>
        <Table stickyHeader>
          <TableHead style={{ background: "#fff" }}>
            <TableRow>
              <TableCell>Adresse</TableCell>
              <TableCell>Code postale</TableCell>
              <TableCell>Ville</TableCell>
              <TableCell>Nombre d'appartements</TableCell>
              <TableCell>Nombre d'appartements occupés</TableCell>
              <TableCell>Créé le </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {building &&
              building.map((building) => (
                <TableRow key={building._id}>
                  <TableCell component="th" scope="row">
                    {editing && data === building._id ? (
                      <TextField
                        id={building.adress}
                        type="text"
                        value={adress}
                        onChange={(e) => setAdress(e.target.value)}
                        placeholder="Adresse"
                      />
                    ) : (
                      building.adress
                    )}
                  </TableCell>
                  <TableCell>
                    {editing && data === building._id ? (
                      <TextField
                        id={building.postalcode}
                        type="number"
                        value={postalcode}
                        onChange={(e) => setPostalcode(e.target.value)}
                        placeholder="Code postale"
                      />
                    ) : (
                      building.postalcode
                    )}
                  </TableCell>
                  <TableCell>
                    {editing && data === building._id ? (
                      <TextField
                        id={building.city}
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ville"
                      />
                    ) : (
                      building.city
                    )}
                  </TableCell>
                  <TableCell>{building.numberofAppart}</TableCell>
                  <TableCell>{building.counter}</TableCell>
                  <TableCell>
                    {moment(building.createdAt).format("LL")}
                  </TableCell>
                  <TableCell>
                    {editing && data === building._id ? (
                      <Fragment>
                        <Button>
                          <CheckIcon onClick={submit} />
                        </Button>
                        <Button>
                          <CloseIcon onClick={() => setEditing(!editing)} />
                        </Button>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Button>
                          <EditIcon
                            onClick={() => {
                              setNumberofAppart(building.numberofAppart);
                              setAdress(building.adress);
                              setPostalcode(building.postalcode);
                              setCity(building.city);
                              setData(building._id);
                              setError("");
                              setSuccess("");
                              setEditing(!editing);
                            }}
                          />
                        </Button>
                        <Button>
                          <DeleteIcon
                            onClick={() => {
                              setData(building);
                              setDeleteShow(!deleteShow);
                            }}
                          />
                        </Button>{" "}
                      </Fragment>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={deleteShow}
        onClose={() => setDeleteShow(!deleteShow)}
        disableBackdropClick
      >
        <DialogTitle>Supprimer un Immeuble</DialogTitle>
        <DialogContent>
          {" "}
          <DialogContent>
            Êtez-vous sûr de vouloir supprimer l'immeuble se trouvant à <br />
            <strong>
              {data.adress} {data.postalcode} {data.city}
            </strong>{" "}
            ? <br />
            Cette action entrainera : <br />
            <List>
              <ListItem>
                la suppression de tous les locataires habitant dans l'immeuble
              </ListItem>
              <ListItem>
                le suppression de tous les contrats liés à l'immeuble
              </ListItem>
            </List>
            Une fois validé, il n'est plus possible de revenir en arrière.
          </DialogContent>
        </DialogContent>
        <Box className={classes.box}>
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => setDeleteShow(!deleteShow)}
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
    </div>
  );
};

export default Building;
