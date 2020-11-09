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
  Button,
  makeStyles,
  Box,
  TextField,
  MenuItem,
  Chip,
  Paper,
  Typography,
  Divider,
  ButtonGroup,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddTenant from "../../components/Tenant/AddTenant";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import HistoryIcon from "@material-ui/icons/History";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteTenant from "../../components/Tenant/DeleteTenant";

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
  },
  divider: {
    marginBottom: 20,
  },
  link: {
    textDecoration: "none",
    color: "#000000",
  },
}));
const Tenant = () => {
  const {
    tenant,
    setTenant,
    getTenants,
    loading,
    setLoading,
    authAxios,
    count,
    setCount,
  } = useContext(UserContext);
  const [deleteShow, setDeleteShow] = useState(false);
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

  const classes = useStyles();
  useEffect(() => {
    getTenants();
  }, [count]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
  };

  const statut = [
    { value: "Actif", label: "Actif" },
    { value: "Inactif", label: "Inactif" },
  ];

  const dynamicSearch = () => {
    if (tenant)
      return tenant.filter(
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
      <Typography variant="h3" color="primary">
        Les locataires
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
          <TableHead style={{ background: "#fff" }}>
            <TableRow>
              <Fragment>
                {[
                  "Locataire n°",
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
          <TableBody>
            <Fragment>
              {tenant.length > 0 ? (
                dynamicSearch().map((tenant) => (
                  <TableRow key={tenant._id}>
                    <TableCell component="th" scope="row">
                      {tenant._id}
                    </TableCell>
                    <TableCell>
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
                    <TableCell>
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
                    <TableCell>
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
                    <TableCell>
                      {editing && data === tenant._id ? (
                        <TextField
                          id={tenant.status}
                          select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          {statut.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <div>
                          {tenant.status == "Actif" ? (
                            <Chip
                              style={{ background: "#52b202", color: "#fff" }}
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
                    <TableCell>
                      {editing && data === tenant._id ? (
                        <TextField
                          id={tenant.dateofbirth}
                          type="date"
                          value={moment(dateofbirth).format("YYYY-MM-DD")}
                          onChange={(e) => setDate(e.target.value)}
                          placeholder="Date de naissance"
                        />
                      ) : (
                        moment(tenant.dateofbirth).format("YYYY-MM-DD")
                      )}
                    </TableCell>
                    <TableCell>
                      {moment(tenant.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {moment(tenant.updatedAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {editing && data === tenant._id ? (
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
                            <Link
                              to={`/tenants/${tenant._id}`}
                              className={classes.link}
                            >
                              <HistoryIcon />
                            </Link>
                          </Button>
                          <Button>
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
                          </Button>
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
      <div style={{ marginTop: "13px" }}>
        <AddTenant />
      </div>
    </div>
  );
};

export default Tenant;
