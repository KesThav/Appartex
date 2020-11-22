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
  MenuItem,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AddContract from "../../components/Contract/AddContract";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteContract from "../../components/Contract/DeleteContract";
import ArchiveContract from "../../components/Contract/ArchiveContract";
import { Prompt } from "react-router-dom";
import ContractDoc from "../../components/Contract/ContractDoc";

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
const Contract = () => {
  const {
    contract,
    getContracts,
    setLoading,
    authAxios,
    loading,
    count,
    setCount,
  } = useContext(UserContext);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [charge, setCharge] = useState(null);
  const [tenantid, setTenantid] = useState(null);
  const [appartid, setAppartid] = useState(null);
  const [rent, setRent] = useState(null);
  const [other, setOther] = useState(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState([]);

  const classes = useStyles();
  useEffect(() => {
    getContracts();
  }, [count]);

  const statut = [
    { value: "", label: "Tout" },
    { value: "Actif", label: "Actif" },
    { value: "Archivé", label: "Archivé" },
  ];

  const handleChangefilter = (filter) => {
    if (activeFilter.includes(filter)) {
      const filterIndex = activeFilter.indexOf(filter);
      const newFilter = [...activeFilter];
      newFilter.splice(filterIndex, 1);
      setActiveFilter(newFilter);
    } else {
      setActiveFilter((oldFilter) => [...oldFilter, filter]);
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
      setCount((count) => count + 1);
      setSuccess("Contrat modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const dynamicSearch = () => {
    if (contract)
      return contract
        .filter((data) =>
          activeFilter.length == 0 ? data : activeFilter.includes(data.status)
        )
        .filter((name) =>
          !name.appartmentid.building
            ? name._id
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              name.charge.toString().includes(search.toString()) ||
              name.rent
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase()) ||
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
              name.tenant.lastname
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              name.appartmentid.adress
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              name.status
                .toLowerCase()
                .includes(search.toString().toLowerCase())
            : name._id
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              name.charge.toString().includes(search.toString()) ||
              name.rent
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase()) ||
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
              name.tenant.lastname
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              name.appartmentid.building.adress
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              name.status
                .toLowerCase()
                .includes(search.toString().toLowerCase())
        );
  };

  return (
    <div>
      <Prompt
        when={editing}
        message="You avez des changements non enregitrés, est-ce sûr de vouloir quitter la page ?"
      />
      <Typography variant="h3">Les contrats</Typography>

      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
      <Paper>
        <Box className={classes.box3}>
          <TextField
            style={{ width: "10%", marginRight: "20px" }}
            label="Statut"
            id="statut"
            select
            variant="outlined"
            onChange={(e) => setActiveFilter(e.target.value)}
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
            style={{ width: "30%", marginRight: "20px" }}
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
                    "contrat n°",
                    "Locataire",
                    "Appartment",
                    "Charge",
                    "Loyer",
                    "Autre",
                    "Statut",
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
                {!loading ? (
                  contract.length > 0 &&
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
                        {moment(contract.createdAt).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        {moment(contract.updatedAt).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        {editing && data === contract._id ? (
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
                            {contract.file.length > 0 && (
                              <ContractDoc
                                data={contract._id}
                                setError={setError}
                              />
                            )}
                            {contract.status !== "Archivé" && (
                              <Fragment>
                                <IconButton>
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
                                </IconButton>
                                <ArchiveContract
                                  data={contract}
                                  setSuccess={setSuccess}
                                  setError={setError}
                                />
                              </Fragment>
                            )}
                            <DeleteContract
                              data={contract}
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
      </Paper>
      <div style={{ marginTop: "13px" }}>
        <AddContract />
      </div>
    </div>
  );
};

export default Contract;
