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
  Dialog,
  DialogContent,
  Box,
  TextField,
  DialogTitle,
  MenuItem,
  Chip,
  List,
  ListItem,
  Paper,
  Typography,
  Divider,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddTenant from "../../components/AddTenant";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import HistoryIcon from "@material-ui/icons/History";

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
  }, []);

  const DeleteTenant = (tenantid) => {
    setLoading(true);
    try {
      authAxios.delete(`tenants/delete/${tenantid}`);
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
      <Typography variant="h4" color="primary">
        Les locataires
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
          style={{ width: "20%" }}
        />
        <Fragment>{tenant && dynamicSearch().length}</Fragment>
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
              {tenant.length > 0 &&
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
                              to={`/tenant/${tenant._id}`}
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
                          <Button>
                            <DeleteIcon
                              onClick={() => {
                                setData(tenant);
                                setDeleteShow(!deleteShow);
                              }}
                            />
                          </Button>{" "}
                        </Fragment>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </Fragment>
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "13px" }}>
        <AddTenant />
      </div>
      <Dialog
        open={deleteShow}
        onClose={() => setDeleteShow(!deleteShow)}
        disableBackdropClick
      >
        <DialogTitle>Supprimer un locataire</DialogTitle>
        <DialogContent>
          Êtez-vous sûr de vouloir supprimer le locataire{" "}
          <strong>
            {data.lastname} {data.name}
          </strong>{" "}
          ? <br />
          Cette action entrainera : <br />
          <List>
            <ListItem>la suppression du locataire</ListItem>
            <ListItem>
              la suppression de tous les contrats liés au locataire
            </ListItem>
            <ListItem>
              la suppression de toutes les factures liées au locataire
            </ListItem>
          </List>
          Une fois validé, il n'est plus possible de revenir en arrière.
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
            onClick={() => DeleteTenant(data._id)}
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

export default Tenant;
