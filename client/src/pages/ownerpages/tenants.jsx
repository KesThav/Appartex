import React, { useState, useContext, useEffect } from "react";
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
  InputAdornment,
  TextField,
  DialogTitle,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddTenant from "../../components/AddTenant";
import moment from "moment";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import Alert from "@material-ui/lab/Alert";

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
    getTenant,
    loading,
    setLoading,
    authAxios,
  } = useContext(UserContext);
  const [deleteShow, setDeleteShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dateofbirth, setDate] = useState();

  const classes = useStyles();
  useEffect(() => {
    getTenant();
  }, []);

  const DeleteTenant = (tenantid) => {
    setLoading(true);
    try {
      authAxios.delete(`tenants/delete/${tenantid}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !lastname || !email || !password || !confirm) {
      setError("Complétez tous les champs");
    } else if (password !== confirm) {
      setError("Les mot de passes ne correspondent pas");
    } else if (password.length < 6) {
      setError("Le mot de passe doit faire minimum 6 charactères");
    } else {
      setLoading(true);
      const updatedata = {
        name,
        lastname,
        email,
        password,
      };
      try {
        await authAxios.put(`/tenants/update/${data}`, updatedata);
        setLoading(false);
        setSuccess("Locataire modifié avec succès");
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  return (
    <div>
      <AddTenant />
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
              tenant.map((tenant, index) => (
                <TableRow key={tenant._id}>
                  <TableCell component="th" scope="row">
                    {tenant.lastname}
                  </TableCell>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>{tenant.status}</TableCell>
                  <TableCell>
                    {moment(tenant.dateofbirth).format("LL")}
                  </TableCell>
                  <TableCell>{moment(tenant.createdAt).format("LL")}</TableCell>
                  <TableCell>
                    <Button>
                      <EditIcon
                        onClick={() => {
                          setName(tenant.name);
                          setLastname(tenant.lastname);
                          setEmail(tenant.email);
                          setDate(tenant.dateofbirth);
                          setData(tenant._id);
                          setEditShow(!editShow);
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

      <Dialog
        open={editShow}
        onClose={() => setEditShow(!editShow)}
        disableBackdropClick
      >
        <DialogTitle>{"Modifier un locataire"}</DialogTitle>
        <DialogContent>
          {err && <Alert severity="error">{err}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <form onSubmit={submit}>
            <TextField
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Prénom"
              className={classes.form}
            />
            <TextField
              id="lastname"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Nom"
              className={classes.form}
            />
            <TextField
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Email"
              className={classes.form}
            />
            <TextField
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Mot de passe"
              className={classes.form}
            />
            <TextField
              id="confirm"
              type="password"
              onChange={(e) => setConfirm(e.target.value)}
              fullWidth
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Confirmer le mot de passe"
              className={classes.form}
            />
            <Box className={classes.box2}>
              <Button
                className={classes.button}
                color="inherit"
                onClick={() => setEditShow(!editShow)}
              >
                Retour
              </Button>

              <Button type="submit" color="primary" className={classes.button}>
                Valider
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tenant;
