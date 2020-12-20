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
  Box,
  TextField,
  Paper,
  Chip,
  Typography,
  IconButton,
  MenuItem,
  FormControl,
  FormControlLabel,
  TablePagination,
  Checkbox,
} from "@material-ui/core";
import { Prompt } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import AddAppart from "../../components/Appart/AddAppart";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteAppart from "../../components/Appart/DeleteAppart";
import ShowDocument from "../../components/Appart/AppartDocumentSkeleton";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AppartToExcel } from "./export";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    maxHeight: "60vh",
    boxShadow: "none",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      textAlign: "center",
    },
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
  searchBar: {
    width: "30%",
    marginRight: 20,
  },
  filter1: { width: "30%", marginRight: "20px" },
  filter2: { width: "10%", marginRight: "20px" },
  [theme.breakpoints.down("sm")]: {
    thead: { display: "none" },
    tbody: { display: "block", width: "100%" },
    trow: {
      display: "block",
      width: "100%",
      marginBottom: 20,
      border: "1px solid grey",
    },
    tcell: {
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
    box3: {
      flexDirection: "column",
    },
    filter1: {
      width: "100%",
      marginBottom: 10,
    },
    filter2: {
      width: "100%",
      marginBottom: 10,
    },
  },
}));
const Appart = () => {
  const {
    appart,
    getApparts,
    setLoading,
    authAxios,
    loading,
    count,
    setCount,
    building,
    getBuildings,
  } = useContext(UserContext);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [size, setSize] = useState(null);
  const [adress, setAdress] = useState(null);
  const [postalcode, setPostalcode] = useState(-1);
  const [city, setCity] = useState(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [build, setBuild] = useState(null);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("");
  const [check, setCheck] = useState(false);
  const [activeFilter, setActiveFilter] = useState([]);
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
    getApparts();
  }, [count]);

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
      setCount((count) => count + 1);
      setSuccess("Appartement modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const statut = [
    { value: "", label: "Tout" },
    { value: "Libre", label: "Libre" },
    { value: "Occupé", label: "Occupé" },
  ];

  const handleChange = (event, filter) => {
    let newData = filter.map((data) => data._id);
    setActiveFilter(newData);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const dynamicSearch = () => {
    if (appart) {
      return appart
        .filter((data) => (check == true ? !data.hasBuilding : appart))
        .filter((data) => {
          if (activeFilter.length == 0) {
            return appart;
          } else {
            return activeFilter.includes(data.building);
          }
        })
        .filter((data) => data.status.includes(status))
        .filter(
          (name) =>
            name.postalcode
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.adress.toLowerCase().includes(search.toLowerCase()) ||
            name.city.toLowerCase().includes(search.toLowerCase()) ||
            name.size
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.status.toLowerCase().includes(search.toString().toLowerCase())
        );
    }
  };
  return (
    <div>
      <Prompt
        when={editing}
        message="Vous avez des changements non enregitrés, êtes-vous sûr de vouloir quitter la page ?"
      />
      <Box className={classes.title}>
        <Typography variant="h3">Les appartements</Typography>
        {appart && <AppartToExcel dynamicSearch={dynamicSearch()} />}
      </Box>

      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
      <Paper>
        <Box className={classes.box3}>
          {building && (
            <Autocomplete
              multiple
              options={building}
              disableCloseOnSelect
              getOptionLabel={(option) =>
                option.adress + " " + option.postalcode + " " + option.city
              }
              onChange={handleChange}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.adress + " " + option.postalcode + " " + option.city}
                </React.Fragment>
              )}
              className={classes.filter1}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Filter par immeuble"
                />
              )}
            />
          )}
          <TextField
            className={classes.filter2}
            label="Statut"
            id="statut"
            select
            variant="outlined"
            onChange={(e) => setStatus(e.target.value)}
          >
            {statut.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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
          <FormControl
            component="fieldset"
            className={classes.formControl}
            style={{ display: "flex", flexDirection: "row", padding: 5 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={check}
                  name={check}
                  onChange={() => setCheck(!check)}
                />
              }
              label={"Afficher que les appartements solitaires"}
            />
          </FormControl>
        </Box>

        <TableContainer component={Paper} square>
          <Table stickyHeader className={classes.table}>
            <TableHead className={classes.thead}>
              <TableRow>
                {[
                  "Appartient à un immeuble ?",
                  "Adresse",
                  "Code postale",
                  "Ville",
                  "Pièces",
                  "Statut",
                  "Créé le",
                  "Dernière modification",
                  "Actions",
                ].map((title, index) => (
                  <TableCell key={index}>
                    <strong>{title}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tbody}>
              <Fragment>
                {!loading ? (
                  appart.length > 0 &&
                  dynamicSearch()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((appart) => (
                      <TableRow key={appart._id} className={classes.trow}>
                        <TableCell
                          component="th"
                          scope="row"
                          data-label="Appartient à un immeuble ?"
                          className={classes.tcell}
                        >
                          {appart.hasBuilding ? "Oui" : "Non"}
                        </TableCell>
                        <TableCell
                          data-label="Adresse"
                          className={classes.tcell}
                        >
                          {editing &&
                          data === appart._id &&
                          !appart.hasBuilding ? (
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
                        <TableCell
                          data-label="Code postale"
                          className={classes.tcell}
                        >
                          {editing &&
                          data === appart._id &&
                          !appart.hasBuilding ? (
                            <TextField
                              id={appart.postalcode.toString()}
                              type="number"
                              value={postalcode}
                              onChange={(e) => setPostalcode(e.target.value)}
                              placeholder="Code postale"
                            />
                          ) : (
                            appart.postalcode
                          )}
                        </TableCell>
                        <TableCell data-label="Ville" className={classes.tcell}>
                          {editing &&
                          data === appart._id &&
                          !appart.hasBuilding ? (
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
                        <TableCell
                          data-label="Pièces"
                          className={classes.tcell}
                        >
                          {editing && data === appart._id ? (
                            <TextField
                              id={appart.size.toString()}
                              type="number"
                              value={size}
                              onChange={(e) => setSize(e.target.value)}
                              placeholder="Pièces"
                            />
                          ) : (
                            appart.size
                          )}
                        </TableCell>
                        <TableCell
                          data-label="Statut"
                          className={classes.tcell}
                        >
                          <div>
                            {appart.status == "Libre" ? (
                              <Chip
                                style={{
                                  background: "#52b202",
                                  color: "#fff",
                                }}
                                label={appart.status}
                              />
                            ) : (
                              <Chip
                                style={{ background: "red", color: "#fff" }}
                                label={appart.status}
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          data-label="Créé le "
                          className={classes.tcell}
                        >
                          {moment(appart.createdAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell
                          data-label="Dernière modification"
                          className={classes.tcell}
                        >
                          {moment(appart.updatedAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell
                          data-label="Actions"
                          className={classes.tcell}
                        >
                          {editing && data === appart._id ? (
                            <Fragment>
                              <Button>
                                <CheckIcon onClick={submit} />
                              </Button>
                              <Button>
                                <CloseIcon
                                  onClick={() => setEditing(!editing)}
                                />
                              </Button>
                            </Fragment>
                          ) : (
                            <Fragment>
                              {appart.picture.length > 0 && (
                                <ShowDocument
                                  appart={appart._id}
                                  setError={setError}
                                />
                              )}
                              <IconButton>
                                <EditIcon
                                  onClick={() => {
                                    if (appart.hasBuilding) {
                                      setSize(appart.size);
                                      setAdress("");
                                      setPostalcode("");
                                      setCity("");
                                      setData(appart._id);
                                      setBuild(appart.building);
                                      setError("");
                                      setSuccess("");
                                      setEditing(!editing);
                                    } else {
                                      setSize(appart.size);
                                      setAdress(appart.adress);
                                      setPostalcode(appart.postalcode);
                                      setCity(appart.city);
                                      setData(appart._id);
                                      setBuild(null);
                                      setError("");
                                      setSuccess("");
                                      setEditing(!editing);
                                    }
                                  }}
                                />
                              </IconButton>
                              <DeleteAppart
                                data={appart}
                                setSuccess={setSuccess}
                                setError={setError}
                              />
                            </Fragment>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <LoadingScreen />
                )}
              </Fragment>
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={appart && dynamicSearch().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <div style={{ marginTop: "13px" }}>
        <AddAppart setSuccess={setSuccess} />
      </div>
    </div>
  );
};

export default Appart;
