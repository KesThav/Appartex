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
  TablePagination,
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
import { ContractToExcel } from "./export";

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
      paddingLeft: "40%",
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

const Contract = () => {
  const classes = useStyles();
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getContracts();
  }, [count]);

  const statut = [
    { value: "", label: "Tout" },
    { value: "Actif", label: "Actif" },
    { value: "Archivé", label: "Archivé" },
  ];

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
        .filter(
          (name) =>
            name.adress
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.postalcode
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.city
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.size
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name._id
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.charge.toString().includes(search.toString()) ||
            name.rent.toString().toLowerCase().includes(search.toLowerCase()) ||
            name.tenant
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.other
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.status.toLowerCase().includes(search.toString().toLowerCase())
        );
  };

  return (
    <div>
      <Prompt
        when={editing}
        message="Vous avez des changements non enregitrés, êtes-vous sûr de vouloir quitter la page ?"
      />
      <Box className={classes.header}>
        <Typography variant="h3">Les contrats</Typography>{" "}
        {contract && <ContractToExcel dynamicSearch={dynamicSearch()} />}
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
            className={classes.filter1}
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
            <TableBody className={classes.tbody}>
              <Fragment>
                {!loading ? (
                  contract.length > 0 &&
                  dynamicSearch()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((contract) => (
                      <TableRow key={contract._id} className={classes.trow}>
                        <TableCell
                          data-label="Contrat n°"
                          className={classes.tcell}
                        >
                          {contract._id}
                        </TableCell>
                        <TableCell
                          data-label="Locataire"
                          className={classes.tcell}
                        >
                          {contract.tenant}
                        </TableCell>
                        <TableCell
                          data-label="Adresse"
                          className={classes.tcell}
                        >
                          {`${contract.adress} ${contract.postalcode} ${contract.city}, ${contract.size} pièces`}
                        </TableCell>
                        <TableCell
                          data-label="Charge"
                          className={classes.tcell}
                        >
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
                        <TableCell data-label="Loyer" className={classes.tcell}>
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
                        <TableCell data-label="Autre" className={classes.tcell}>
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
                        <TableCell
                          data-label="Statut"
                          className={classes.tcell}
                        >
                          {contract.status}
                        </TableCell>
                        <TableCell
                          data-label="Créé le"
                          className={classes.tcell}
                        >
                          {moment(contract.createdAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell
                          data-label="Dernière modification"
                          className={classes.tcell}
                        >
                          {moment(contract.updatedAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell
                          data-label="Actions"
                          className={classes.tcell}
                        >
                          {editing && data === contract._id ? (
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
                                        setTenantid(contract.tenantid);
                                        setAppartid(contract.appartid);
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contract && dynamicSearch().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <div style={{ marginTop: "13px" }}>
        <AddContract setSuccess={setSuccess} />
      </div>
    </div>
  );
};

export default Contract;
