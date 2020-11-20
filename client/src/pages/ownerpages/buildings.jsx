import React, { useState, useContext, useEffect, Fragment } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  makeStyles,
  Box,
  TextField,
  Paper,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AddBuilding from "../../components/Building/AddBuilding";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteBuilding from "../../components/Building/DeleteBuilding";
import BuildingTenants from "../../components/Building/BuildingTenants";
import { Prompt } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    maxHeight: "60vh",
    boxShadow: "none",
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
    padding: 15,
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
    getBuildings,
    setLoading,
    authAxios,
    loading,
    count,
    setCount,
  } = useContext(UserContext);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adress, setAdress] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [city, setCity] = useState("");
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  const classes = useStyles();
  useEffect(() => {
    getBuildings();
  }, [count]);

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
      <Prompt
        when={editing}
        message="You avez des changements non enregitrés, est-ce sûr de vouloir quitter la page ?"
      />
      <Typography variant="h3">Les immeubles</Typography>
      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
      <Paper>
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
                          <IconButton>
                            <CheckIcon onClick={submit} />
                          </IconButton>
                          <IconButton>
                            <CloseIcon onClick={() => setEditing(!editing)} />
                          </IconButton>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <BuildingTenants
                            data={building._id}
                            setError={setError}
                          />
                          <IconButton>
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
                          </IconButton>
                          <DeleteBuilding
                            data={building}
                            setSuccess={setSuccess}
                            setError={setError}
                          />
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
      </Paper>
      <div style={{ marginTop: "13px" }}>
        <AddBuilding />
      </div>
    </div>
  );
};

export default Building;
