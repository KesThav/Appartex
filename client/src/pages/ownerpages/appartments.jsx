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
  Paper,
  Avatar,
  Typography,
  Divider,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddAppart from "../../components/AddAppart";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    height: "60vh",
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
  box3: {
    marginBottom: 13,
    paddingRight: 120,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    background: [theme.palette.secondary.main],
  },
  divider: {
    marginBottom: 20,
  },
}));
const Appart = () => {
  const { appart, getApparts, setAppart, setLoading, authAxios } = useContext(
    UserContext
  );
  const [deleteShow, setDeleteShow] = useState(false);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [size, setSize] = useState(null);
  const [adress, setAdress] = useState(null);
  const [postalcode, setPostalcode] = useState(null);
  const [city, setCity] = useState(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [build, setBuild] = useState(null);

  const classes = useStyles();
  useEffect(() => {
    getApparts();
  }, []);

  const DeleteAppart = (appartid) => {
    setLoading(true);
    try {
      authAxios.delete(`appartments/delete/${appartid}`);
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
      size,
      city,
      adress,
      postalcode,
      building: build,
    };
    try {
      await authAxios.put(`/appartments/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setSuccess("Immeuble modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const dynamicSearch = () => {
    if (appart && !appart.building) {
      return appart.filter(
        (name) =>
          name._id
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          name.adress.toLowerCase().includes(search.toLowerCase()) ||
          name.city.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return appart.filter(
        (name) =>
          name._id
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          name.building.adress.toLowerCase().includes(search.toLowerCase()) ||
          name.building.city.toLowerCase().includes(search.toLowerCase())
      );
    }
  };
  return (
    <div>
      <Typography variant="h4" color="primary">
        Les Appartements
      </Typography>
      <Divider className={classes.divider} />
      {err && <Alert severity="error">{err}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box className={classes.box3}>
        <TextField
          variant="outlined"
          id="search"
          type="text"
          value={search}
          placeholder="Filter"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          style={{ width: "40%" }}
        />
      </Box>
      <TableContainer className={classes.table} component={Paper} square>
        <Table stickyHeader>
          <TableHead style={{ background: "#fff" }}>
            <TableRow>
              <TableCell>Immeuble ?</TableCell>
              <TableCell>
                <strong>Appartment n°</strong>
              </TableCell>
              <TableCell>
                <strong>Adresse</strong>
              </TableCell>
              <TableCell>
                <strong>Code postale</strong>
              </TableCell>
              <TableCell>
                <strong>Ville</strong>
              </TableCell>
              <TableCell>
                <strong>Taille</strong>
              </TableCell>
              <TableCell>
                <strong>Statut</strong>
              </TableCell>
              <TableCell>
                <strong>Créé le </strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appart &&
              dynamicSearch().map((appart) => {
                return !appart.building ? (
                  <TableRow key={appart._id}>
                    <TableCell component="th" scope="row">
                      Non
                    </TableCell>
                    <TableCell>{appart._id}</TableCell>
                    <TableCell>
                      {editing && data === appart._id ? (
                        <TextField
                          id={appart.adress}
                          type="text"
                          value={adress}
                          onChange={(e) => setAdress(e.target.value)}
                          placeholder="Adresse"
                        />
                      ) : (
                        appart.adress
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && data === appart._id ? (
                        <TextField
                          id={appart.postalcode}
                          type="number"
                          value={postalcode}
                          onChange={(e) => setPostalcode(e.target.value)}
                          placeholder="Code postale"
                        />
                      ) : (
                        appart.postalcode
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && data === appart._id ? (
                        <TextField
                          id={appart.city}
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ville"
                        />
                      ) : (
                        appart.city
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && data === appart._id ? (
                        <TextField
                          id={appart.size}
                          type="number"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          placeholder="Ville"
                        />
                      ) : (
                        appart.size
                      )}
                    </TableCell>
                    <TableCell>{appart.status}</TableCell>
                    <TableCell>
                      {moment(appart.createdAt).format("LL")}
                    </TableCell>
                    <TableCell>
                      {editing && data === appart._id ? (
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
                                setSize(appart.size);
                                setAdress(appart.adress);
                                setPostalcode(appart.postalcode);
                                setCity(appart.city);
                                setData(appart._id);
                                setError("");
                                setSuccess("");
                                setEditing(!editing);
                              }}
                            />
                          </Button>
                          <Button>
                            <DeleteIcon
                              onClick={() => {
                                setData(appart);
                                setDeleteShow(!deleteShow);
                              }}
                            />
                          </Button>{" "}
                        </Fragment>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={appart._id}>
                    <TableCell component="th" scope="row">
                      Oui
                    </TableCell>
                    <TableCell>{appart._id}</TableCell>
                    <TableCell>{appart.building.adress}</TableCell>
                    <TableCell>{appart.building.postalcode}</TableCell>
                    <TableCell>{appart.building.city}</TableCell>
                    <TableCell>
                      {editing && data === appart._id ? (
                        <TextField
                          id={appart.size}
                          type="number"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          placeholder="Ville"
                        />
                      ) : (
                        appart.size
                      )}
                    </TableCell>
                    <TableCell>{appart.status}</TableCell>
                    <TableCell>
                      {moment(appart.createdAt).format("LL")}
                    </TableCell>
                    <TableCell>
                      {editing && data === appart._id ? (
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
                                setSize(appart.size);
                                setBuild(appart.building._id);
                                setData(appart._id);
                                setError("");
                                setSuccess("");
                                setEditing(!editing);
                              }}
                            />
                          </Button>
                          <Button>
                            <DeleteIcon
                              onClick={() => {
                                setData(appart);
                                setDeleteShow(!deleteShow);
                              }}
                            />
                          </Button>{" "}
                        </Fragment>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "13px" }}>
        <AddAppart />
      </div>

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
                la suppression de tous les appartements liés dans l'immeuble
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
            onClick={() => DeleteAppart(data._id)}
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

export default Appart;
