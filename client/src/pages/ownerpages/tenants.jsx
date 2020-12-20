import React, { useState, useContext, useEffect, Fragment } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import { Link } from "react-router-dom";
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
  MenuItem,
  Chip,
  Paper,
  Typography,
  TablePagination,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AddTenant from "../../components/Tenant/AddTenant";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteTenant from "../../components/Tenant/DeleteTenant";
import { Prompt } from "react-router-dom";
import { TenantToExcel } from "./export";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    maxHeight: "60vh",
    boxShadow: "none",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
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
  },
  divider: {
    marginBottom: 20,
  },
  link: {
    textDecoration: "none",
    color: "#000000",
  },
  searchBar: {
    width: "30%",
    marginRight: 20,
  },
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
const Tenant = () => {
  const {
    tenant,
    getTenants,
    setLoading,
    authAxios,
    count,
    setCount,
    loading,
  } = useContext(UserContext);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [dateofbirth, setDate] = useState();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
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
    getTenants();
  }, [count]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (moment().diff(moment(dateofbirth), "years") < 18) {
      setError(
        "Le locataire ne peut pas être créé par la personne n'est pas majeur"
      );
    } else if (!name || !lastname || !email || !dateofbirth) {
      setError("Complétez tous les champs");
    } else {
      setLoading(true);
      const updatedata = {
        name,
        lastname,
        email,
        dateofbirth,
        status,
      };
      try {
        await authAxios.put(`/tenants/update/${data}`, updatedata);
        setLoading(false);
        setEditing(false);
        setCount((count) => count + 1);
        setSuccess("Locataire modifié avec succès");
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const statut = [
    { value: "Actif", label: "Actif" },
    { value: "Inactif", label: "Inactif" },
  ];

  const statuts = [
    { value: "", label: "Tout" },
    { value: "Actif", label: "Actif" },
    { value: "Inactif", label: "Inactif" },
  ];

  const dynamicSearch = () => {
    if (tenant)
      return tenant
        .filter((data) => data.status.includes(filter))
        .filter(
          (name) =>
            name._id
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.name.toLowerCase().includes(search.toLowerCase()) ||
            name.lastname.toLowerCase().includes(search.toLowerCase()) ||
            name.email.toLowerCase().includes(search.toLowerCase()) ||
            name.status.toLowerCase().includes(search.toLowerCase())
        );
  };

  return (
    <div>
      <Prompt
        when={editing}
        message="Vous avez des changements non enregitrés, êtes-vous sûr de vouloir quitter la page ?"
      />
      <Box className={classes.header}>
        <Typography variant="h3">Les locataires</Typography>{" "}
        {tenant && <TenantToExcel dynamicSearch={dynamicSearch()} />}
      </Box>
      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
      <Paper>
        <Box className={classes.box3}>
          <TextField
            className={classes.filter2}
            label="Statut"
            id="statut"
            select
            variant="outlined"
            onChange={(e) => setFilter(e.target.value)}
          >
            {statuts.map((option) => (
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
        </Box>
        <TableContainer component={Paper} square>
          <Table stickyHeader className={classes.table}>
            <TableHead className={classes.thead}>
              <TableRow>
                <Fragment>
                  {[
                    "Nom",
                    "Prénom",
                    "Email",
                    "Statut",
                    "Né le",
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
              <Fragment>
                {!loading ? (
                  tenant.length > 0 &&
                  dynamicSearch()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((tenant) => (
                      <TableRow key={tenant._id} className={classes.trow}>
                        <TableCell data-label="Nom" className={classes.tcell}>
                          {editing && data === tenant._id ? (
                            <TextField
                              id={tenant.lastname}
                              type="text"
                              value={lastname}
                              onChange={(e) => setLastname(e.target.value)}
                              placeholder="Nom"
                            />
                          ) : (
                            tenant.lastname
                          )}
                        </TableCell>
                        <TableCell
                          data-label="Prénom"
                          className={classes.tcell}
                        >
                          {editing && data === tenant._id ? (
                            <TextField
                              id={tenant.name}
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Prénom"
                            />
                          ) : (
                            tenant.name
                          )}
                        </TableCell>
                        <TableCell data-label="Email" className={classes.tcell}>
                          {editing && data === tenant._id ? (
                            <TextField
                              id={tenant.email}
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email"
                            />
                          ) : (
                            tenant.email
                          )}
                        </TableCell>
                        <TableCell
                          data-label="Statut"
                          className={classes.tcell}
                        >
                          {editing && data === tenant._id ? (
                            <TextField
                              id={tenant.status}
                              select
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              {statut.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          ) : (
                            <div>
                              {tenant.status == "Actif" ? (
                                <Chip
                                  style={{
                                    background: "#52b202",
                                    color: "#fff",
                                  }}
                                  label={tenant.status}
                                />
                              ) : (
                                <Chip
                                  style={{ background: "red", color: "#fff" }}
                                  label={tenant.status}
                                />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell
                          data-label="Date de naissance"
                          className={classes.tcell}
                        >
                          {editing && data === tenant._id ? (
                            <TextField
                              id={tenant.dateofbirth}
                              type="date"
                              value={moment(dateofbirth).format("YYYY-MM-DD")}
                              onChange={(e) => setDate(e.target.value)}
                              placeholder="Date de naissance"
                            />
                          ) : (
                            moment(tenant.dateofbirth).format("DD/MM/YY")
                          )}
                        </TableCell>
                        <TableCell
                          data-label="Créé le"
                          className={classes.tcell}
                        >
                          {moment(tenant.createdAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell
                          data-label="Dernière modification"
                          className={classes.tcell}
                        >
                          {moment(tenant.updatedAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell
                          data-label="Actions"
                          className={classes.tcell}
                        >
                          {editing && data === tenant._id ? (
                            <Fragment>
                              <IconButton>
                                <CheckIcon onClick={submit} />
                              </IconButton>
                              <IconButton>
                                <CloseIcon
                                  onClick={() => setEditing(!editing)}
                                />
                              </IconButton>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <Link
                                to={`/tenants/${tenant._id}`}
                                className={classes.link}
                              >
                                <IconButton>
                                  <ArrowForwardIcon />
                                </IconButton>
                              </Link>
                              <IconButton>
                                <EditIcon
                                  onClick={() => {
                                    setName(tenant.name);
                                    setLastname(tenant.lastname);
                                    setEmail(tenant.email);
                                    setDate(tenant.dateofbirth);
                                    setData(tenant._id);
                                    setStatus(tenant.status);
                                    setError("");
                                    setSuccess("");
                                    setEditing(!editing);
                                  }}
                                />
                              </IconButton>
                              <DeleteTenant
                                data={tenant}
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
          count={tenant && dynamicSearch().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <div style={{ marginTop: "13px" }}>
        <AddTenant setSuccess={setSuccess} />
      </div>
    </div>
  );
};

export default Tenant;
