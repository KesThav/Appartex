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
  MenuItem,
  Chip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddTenant from "../../components/AddTenant";
import moment from "moment";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
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
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dateofbirth, setDate] = useState();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");

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

  return (
    <div>
      <AddTenant />
      {err && <Alert severity="error">{err}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TableContainer className={classes.table}>
        <Table stickyHeader>
          <TableHead style={{ background: "#fff" }}>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Né le</TableCell>
              <TableCell>Créé le</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenant &&
              tenant.map((tenant) => (
                <TableRow key={tenant._id}>
                  <TableCell component="th" scope="row">
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
                        {tenant.status === "Actif" ? (
                          <Chip
                            variant="outlined"
                            color="primary"
                            size="small"
                            label={tenant.status}
                          />
                        ) : (
                          <Chip
                            variant="outlined"
                            color="secondary"
                            size="small"
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
                      moment(tenant.dateofbirth).format("LL")
                    )}
                  </TableCell>
                  <TableCell>{moment(tenant.createdAt).format("LL")}</TableCell>
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
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={deleteShow}
        onClose={() => setDeleteShow(!deleteShow)}
        disableBackdropClick
      >
        <DialogTitle>Supprimer un locataire</DialogTitle>
        <DialogContent>{`Êtez-vous sûr de vouloir supprimer le locataire ${data.lastname} ${data.name} ? La suppression est irréversible.`}</DialogContent>
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
