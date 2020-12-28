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
  TablePagination,
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
import { BuildingToExcel } from "./export";
import { TableSkeleton } from '../../components/Skeleton/TableSkeleton'

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    maxHeight: "60vh",
    boxShadow: "none",
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
  searchBar: {
    width: "30%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  [theme.breakpoints.down("sm")]: {
    thead: { display: "none" },
    tbody: { display: "block", width: "100%" },
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
      textAlign: "right",
      paddingLeft: "50%",
      position: "relative",
      "&::before": {
        content: "attr(data-label)",
        position: "absolute",
        left: 5,
        justifyContent: "center",
        fontWeight: "bold",
      },
    },
    searchBar: {
      width: "100%",
    },
    header: {
      flexDirection: "column",
      textAlign: "center",
    },
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        message="Vous avez des changements non enregitrés, êtes-vous sûr de vouloir quitter la page ?"
      />
      <Box className={classes.header}>
        <Typography variant="h3">Les immeubles</Typography>
        {building && <BuildingToExcel dynamicSearch={dynamicSearch()} />}
      </Box>

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
            placeholder="Chercher"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className={classes.searchBar}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer component={Paper} square className={classes.table}>
          <Table stickyHeader>
            <TableHead className={classes.thead}>
              <TableRow className={classes.trow}>
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
            <TableBody className={classes.tbody}>
              {!loading ? (
                building.length > 0 &&
                dynamicSearch()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((building) => (
                    <TableRow key={building._id} className={classes.trow}>
                      <TableCell data-label="Adresse" className={classes.tcell}>
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
                      <TableCell
                        data-label="Code postale"
                        className={classes.tcell}
                      >
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
                      <TableCell data-label="Ville" className={classes.tcell}>
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
                      <TableCell
                        data-label="Nombre d'appartements"
                        className={classes.tcell}
                      >
                        {building.numberofAppart}
                      </TableCell>
                      <TableCell
                        data-label="Nombre d'appartements occupés"
                        className={classes.tcell}
                      >
                        {building.counter}
                      </TableCell>
                      <TableCell data-label="Créé le" className={classes.tcell}>
                        {moment(building.createdAt).format("DD/MM/YY")}
                      </TableCell>
                      <TableCell
                        data-label="Dernière modification"
                        className={classes.tcell}
                      >
                        {moment(building.updatedAt).format("DD/MM/YY")}
                      </TableCell>
                      <TableCell data-label="Actions" className={classes.tcell}>
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
                  <TableSkeleton count={8}/>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={building && dynamicSearch().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <div style={{ marginTop: "13px" }}>
        <AddBuilding setSuccess={setSuccess} />
      </div>
    </div>
  );
};

export default Building;
