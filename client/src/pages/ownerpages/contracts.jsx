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
import AddContract from "../../components/AddContract";
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
  box4: {
    display: "flex",
  },
}));
const Contract = () => {
  const {
    tenant,
    getTenants,
    appart,
    getApparts,
    contract,
    getContracts,
    setLoading,
    authAxios,
  } = useContext(UserContext);
  const [deleteShow, setDeleteShow] = useState(false);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [charge, setCharge] = useState(null);
  const [tenantid, setTenantid] = useState(null);
  const [appartid, setAppartid] = useState(null);
  const [rent, setRent] = useState("");
  const [other, setOther] = useState(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  const classes = useStyles();
  useEffect(() => {
    getApparts();
    getContracts();
    getTenants();
  }, [contract]);

  const DeleteBuilding = (buildingid) => {
    setLoading(true);
    try {
      authAxios.delete(`contracts/delete/${buildingid}`);
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
      charge,
      rent,
      tenant: tenantid,
      appartmentid: appartid,
      other,
    };
    try {
      await authAxios.put(`/contracts/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setSuccess("Contrat modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const dynamicSearch = () => {
    if (contract)
      return contract.filter((name) =>
        !name.appartmentid.building
          ? name._id
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.charge.toString().includes(search.toString()) ||
            name.rent.toString().toLowerCase().includes(search.toLowerCase()) ||
            name.tenant
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.appartmentid
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.other
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
            name.tenant.lastname.toLowerCase().includes(search.toLowerCase()) ||
            name.appartmentid.adress
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            name.status.toLowerCase().includes(search.toString().toLowerCase())
          : name._id
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.charge.toString().includes(search.toString()) ||
            name.rent.toString().toLowerCase().includes(search.toLowerCase()) ||
            name.tenant
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.appartmentid
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.other
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
            name.tenant.lastname.toLowerCase().includes(search.toLowerCase()) ||
            name.appartmentid.building.adress
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            name.status.toLowerCase().includes(search.toString().toLowerCase())
      );
  };

  return (
    <div>
      <Typography variant="h4" color="primary">
        Les contrats
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
              <Fragment>
                {[
                  "contrat n°",
                  "Locataire",
                  "Appartment",
                  "Charge",
                  "Loyer",
                  "Autre",
                  "Statut",
                  "Créé le",
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
              {contract &&
                dynamicSearch().map((contract) => (
                  <TableRow key={contract._id}>
                    <TableCell component="th" scope="row">
                      {contract._id}
                    </TableCell>
                    <TableCell>
                      {contract.tenant.name + " " + contract.tenant.lastname}
                    </TableCell>
                    <TableCell>
                      {!contract.appartmentid.building
                        ? contract.appartmentid.adress
                        : contract.appartmentid.building.adress}
                    </TableCell>
                    <TableCell>
                      {editing && data === contract._id ? (
                        <TextField
                          id={contract.charge}
                          type="number"
                          value={charge}
                          onChange={(e) => setCharge(e.target.value)}
                          placeholder="Charge"
                        />
                      ) : (
                        contract.charge
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && data === contract._id ? (
                        <TextField
                          id={contract.rent}
                          type="number"
                          value={rent}
                          onChange={(e) => setRent(e.target.value)}
                          placeholder="Loyer"
                        />
                      ) : (
                        contract.rent
                      )}
                    </TableCell>
                    <TableCell>
                      {editing && data === contract._id ? (
                        <TextField
                          id={contract.other}
                          type="text"
                          value={other}
                          onChange={(e) => setOther(e.target.value)}
                          placeholder="Autres"
                        />
                      ) : (
                        contract.other
                      )}
                    </TableCell>
                    <TableCell>{contract.status}</TableCell>
                    <TableCell>
                      {moment(contract.createdAt).format("LL")}
                    </TableCell>
                    <TableCell>
                      {editing && data === contract._id ? (
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
                                setCharge(contract.charge);
                                setRent(contract.rent);
                                setTenantid(contract.tenant._id);
                                setAppartid(contract.appartmentid._id);
                                setOther(contract.other);
                                setData(contract._id);
                                setError("");
                                setSuccess("");
                                setEditing(!editing);
                              }}
                            />
                          </Button>
                          <Button>
                            <DeleteIcon
                              onClick={() => {
                                setData(contract);
                                setDeleteShow(!deleteShow);
                              }}
                            />
                          </Button>
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
        <AddContract />
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
            Êtez-vous sûr de vouloir supprimer le contract <br />
            <strong>{data._id}</strong> ? <br />
            Cette action entrainera : <br />
            <List>
              <ListItem>L'appartment lié au contract passera en libre</ListItem>
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

export default Contract;
