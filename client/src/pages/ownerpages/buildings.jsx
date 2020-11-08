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
  Typography,
  Divider,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddBuilding from "../../components/AddBuilding";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    height: "60vh",
    color: "#fff",
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
  box4: {
    display: "flex",
  },
}));
const Building = (props) => {
  const {
    building,
    setBuilding,
    getBuildings,
    setLoading,
    authAxios,
    loading,
  } = useContext(UserContext);
  const [deleteShow, setDeleteShow] = useState(false);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adress, setAdress] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [city, setCity] = useState("");
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);

  const classes = useStyles();
  useEffect(() => {
    getBuildings();
  }, [count]);

  const DeleteBuilding = async (buildingid) => {
    setDeleteShow(!deleteShow);
    setLoading(true);

    try {
      await authAxios.delete(`buildings/delete/${buildingid}`);
      setLoading(false);
      setSuccess("Immeuble supprimé avec succès");
      setCount((count) => count + 1);
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
      city,
      adress,
      postalcode,
    };
    try {
      await authAxios.put(`/buildings/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setCount((count) => count + 1);
      setSuccess("Immeuble modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const dynamicSearch = () => {
    if (building)
      return building.filter(
        (name) =>
          name._id
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          name.postalcode.toString().includes(search.toString()) ||
          name.adress.toLowerCase().includes(search.toLowerCase()) ||
          name.city.toLowerCase().includes(search.toLowerCase())
      );
  };

  return (
    <div>
      <Typography variant="h3" color="primary">
        Les immeubles
      </Typography>

      <Divider className={classes.divider} />
      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>

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
          style={{ width: "30%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer className={classes.table} component={Paper} square>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <Fragment>
                {[
                  "Immeuble n°",
                  "Adresse",
                  "Code postale",
                  "Ville",
                  "Nombre d'appartements",
                  "Nombre d'appartements occupés",
                  "Créé le",
                  "Dernière modification",
                  "Actions",
                ].map((title, index) => (
                  <TableCell key={index}>
                    <strong>{title}</strong>
                  </TableCell>
                ))}
              </Fragment>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              building.length > 0 &&
              dynamicSearch().map((building) => (
                <TableRow key={building._id}>
                  <TableCell component="th" scope="row">
                    {building._id}
                  </TableCell>
                  <TableCell>
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
                        id={building.postalcode.toString()}
                        type="text"
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
                    {moment(building.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {moment(building.updatedAt).format("YYYY-MM-DD")}
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
                        </Button>
                      </Fragment>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <LoadingScreen />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "13px" }}>
        <AddBuilding />
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
