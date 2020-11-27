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
  Chip,
  Checkbox,
  TablePagination,
} from "@material-ui/core";
import DeleteBills from "../../components/Bill/DeleteBills";
import EditIcon from "@material-ui/icons/Edit";
import AddBills from "../../components/Bill/AddBills";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import BillHistory from "../../components/Bill/BillHistory";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { Prompt } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

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
    alignItems: "center",
    alignContent: "center",
  },
  avatar: {
    background: [theme.palette.secondary.main],
  },
  divider: {
    marginBottom: 20,
  },
  Box4: {
    paddingRight: "10%",
    paddingLeft: "10%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "row",
    height: 75,
    boxShadow: "none",
    marginLeft: "10%",
  },
  iconBox: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
const Bills = () => {
  const {
    bill,
    status,
    getBills,
    setLoading,
    authAxios,
    loading,
    count,
    setCount,
    getStatus,
  } = useContext(UserContext);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [tenantid, setTenantid] = useState("");
  const [statusid, setStatusid] = useState("");
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [upbound, setUpbound] = useState(999999);
  const [lowbound, setLowbound] = useState(-999999);
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
    getStatus();
    getBills();
  }, [count]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (moment(endDate).diff(moment(), "days") < 0) {
      setError("La date ne peut pas être dans le passé");
    } else {
      setLoading(true);
      const updatedata = {
        reference,
        reason,
        tenant: tenantid,
        status: statusid,
        endDate,
        amount,
      };
      try {
        await authAxios.put(`/bills/update/${data}`, updatedata);
        setLoading(false);
        setEditing(false);
        setSuccess("Facture modifié avec succès");
        setCount((count) => count + 1);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const statut = [
    { id: 0, value: 30, label: "Plus de 30 jours" },
    { id: 1, value: 15, label: "Entre 30 et 15 jours" },
    { id: 2, value: 0, label: "Moins de 15 jours" },
    { id: 3, value: -100, label: "En retard" },
    { id: 4, value: -999999, label: "Tout" },
  ];

  const dynamicSearch = () => {
    if (bill) {
      return bill
        .filter((data) =>
          activeFilter.length == 0
            ? bill
            : activeFilter.includes(data.status._id)
        )
        .filter(
          (data) => moment(data.endDate).diff(moment(), "days") > lowbound
        )
        .filter(
          (data) => moment(data.endDate).diff(moment(), "days") <= upbound
        )
        .filter((data) => data.status._id.includes(filter))
        .filter(
          (name) =>
            name._id
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
            name.tenant.lastname.toLowerCase().includes(search.toLowerCase()) ||
            name.reference
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.amount
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.reason.toLowerCase().includes(search.toLowerCase()) ||
            name.status.name.toLowerCase().includes(search.toLowerCase())
        );
    }
  };
  const handleChange = (event, filter) => {
    let newData = filter.map((data) => data._id);
    setActiveFilter(newData);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  return (
    <div>
      <Prompt
        when={editing}
        message="Vous avez des changements non enregitrés, êtes-vous sûr de vouloir quitter la page ?"
      />
      <Typography variant="h3">Les factures</Typography>
      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>

      <Paper>
        <Box className={classes.box3}>
          {status && (
            <Autocomplete
              multiple
              options={status}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              onChange={handleChange}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </React.Fragment>
              )}
              style={{ width: "30%", marginRight: "20px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Filter par statut"
                />
              )}
            />
          )}
          <TextField
            style={{ width: "10%", marginRight: "20px" }}
            variant="outlined"
            id="Nombre de jours restant"
            select
            value={lowbound}
            label="Nombre de jours"
            onChange={(e) => {
              setLowbound(e.target.value);
              if (e.target.value == 30) {
                setUpbound(99999);
              } else if (e.target.value == 15) {
                setUpbound(30);
              } else if (e.target.value == 0) {
                setUpbound(15);
              } else if (e.target.value == -100) {
                setUpbound(0);
              } else {
                setUpbound(999999);
              }
            }}
          >
            {statut.map((option) => (
              <MenuItem key={option.id} value={option.value}>
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
            style={{ width: "30%", marginRight: 20 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Chip
            variant="outlined"
            color="primary"
            label={
              bill &&
              " " +
                dynamicSearch().reduce((acc, data) => acc + data.amount, 0) +
                " CHF"
            }
            deleteIcon={<TrendingUpIcon style={{ color: "52b202" }} />}
            onDelete={() => console.log("wow")}
          />
        </Box>

        <TableContainer className={classes.table} component={Paper} square>
          <Table stickyHeader>
            <TableHead style={{ background: "#fff" }}>
              <TableRow>
                {[
                  "Facture n°",
                  "Locataire",
                  "Référence",
                  "Raison",
                  "Montant (CHF)",
                  "Statut",
                  "Echéance",
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
            <TableBody>
              <Fragment>
                {!loading ? (
                  bill.length > 0 &&
                  dynamicSearch()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((bill) => (
                      <TableRow key={bill._id}>
                        <TableCell>{bill._id}</TableCell>
                        <TableCell>
                          {bill.tenant.name + " " + bill.tenant.lastname}
                        </TableCell>
                        <TableCell>{bill.reference}</TableCell>
                        <TableCell>{bill.reason}</TableCell>
                        <TableCell>{bill.amount}</TableCell>
                        <TableCell>
                          {editing && data === bill._id ? (
                            <TextField
                              id="Status"
                              select
                              value={statusid}
                              onChange={(e) => setStatusid(e.target.value)}
                              fullWidth
                            >
                              {status &&
                                status.map((option) => (
                                  <MenuItem key={option._id} value={option._id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                            </TextField>
                          ) : (
                            bill.status.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editing && data === bill._id ? (
                            <TextField
                              id="endDate"
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              fullWidth
                            />
                          ) : moment(bill.endDate).diff(moment(), "days") >
                            30 ? (
                            <Chip
                              style={{ background: "#29b6f6", color: "#fff" }}
                              label={moment(bill.endDate).format("DD/MM/YY")}
                            />
                          ) : moment(bill.endDate).diff(moment(), "days") <=
                              30 &&
                            moment(bill.endDate).diff(moment(), "days") > 15 ? (
                            <Chip
                              style={{ background: "#52b202", color: "#fff" }}
                              label={moment(bill.endDate).format("DD/MM/YY")}
                            />
                          ) : moment(bill.endDate).diff(moment(), "days") <=
                              15 &&
                            moment(bill.endDate).diff(moment(), "days") > 0 ? (
                            <Chip
                              style={{ background: "#ffb300", color: "#fff" }}
                              label={moment(bill.endDate).format("DD/MM/YY")}
                            />
                          ) : (
                            <Chip
                              style={{ background: "#dd2c00", color: "#fff" }}
                              label={moment(bill.endDate).format("DD/MM/YY")}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {moment(bill.createdAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell>
                          {moment(bill.updateddAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell>
                          {editing && data === bill._id ? (
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
                              <BillHistory
                                data={bill._id}
                                setError={setError}
                              />
                              <IconButton>
                                <EditIcon
                                  onClick={() => {
                                    setReference(bill.reference);
                                    setAmount(bill.amount);
                                    setReason(bill.reason);
                                    setTenantid(bill.tenant._id);
                                    setStatusid(bill.status._id);
                                    setEndDate(
                                      moment(bill.endDate).format("YYYY-MM-DD")
                                    );
                                    setData(bill._id);
                                    setError("");
                                    setSuccess("");
                                    setEditing(!editing);
                                  }}
                                />
                              </IconButton>
                              <DeleteBills
                                data={bill}
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
          count={bill && bill.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <div style={{ marginTop: "13px" }}>
        <AddBills />
      </div>
    </div>
  );
};

export default Bills;
