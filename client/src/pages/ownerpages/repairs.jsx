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
  MenuItem,
  Typography,
  Checkbox,
  Chip,
  TablePagination,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteRepair from "../../components/Repair/DeleteRepair";
import RepairHistory from "../../components/Repair/RepairHistory";
import AddRepair from "../../components/Repair/AddRepair";
import { Prompt } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import { RepairToExcel } from "./export";

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
}));
const Repair = () => {
  const {
    repair,
    getRepairs,
    setLoading,
    authAxios,
    loading,
    count,
    setCount,
    status,
    getStatus,
  } = useContext(UserContext);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reason, setReason] = useState(null);
  const [statusid, setStatusid] = useState(null);
  const [task, setTask] = useState("");
  const [amount, setAmount] = useState(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
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

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const classes = useStyles();
  useEffect(() => {
    getRepairs();
    getStatus();
  }, [count]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const updatedata = {
      amount,
      reason,
      taskid: task,
      status: statusid,
    };
    try {
      await authAxios.put(`/repairs/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setCount((count) => count + 1);
      setSuccess("Réparation modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const handleChange = (event, filter) => {
    let newData = filter.map((data) => data._id);
    setActiveFilter(newData);
  };

  const dynamicSearch = () => {
    if (repair) {
      return repair
        .filter((data) =>
          activeFilter.length == 0
            ? repair
            : activeFilter.includes(data.status._id)
        )
        .filter((data) => data.status._id.includes(filter))
        .filter(
          (name) =>
            name._id
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.reason
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.status.name
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            name.amount.toString().includes(search.toString())
        );
    }
  };
  return (
    <div>
      <Prompt
        when={editing}
        message="Vous avez des changements non enregitrés, êtes-vous sûr de vouloir quitter la page ?"
      />
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Les réparations</Typography>{" "}
        {repair && <RepairToExcel dynamicSearch={dynamicSearch()} />}
      </Box>
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
              style={{ width: "20%", marginRight: "20px" }}
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
              repair &&
              " " +
                dynamicSearch().reduce((acc, data) => acc + data.amount, 0) +
                " CHF"
            }
            deleteIcon={<TrendingDownIcon style={{ color: "#dd2c00" }} />}
            onDelete={() => console.log("wow")}
          />
        </Box>
        <TableContainer className={classes.table} component={Paper} square>
          <Table stickyHeader /* style={{ tableLayout: "fixed" }} */>
            <TableHead style={{ background: "#fff" }}>
              <TableRow>
                {[
                  "Réparation n°",
                  "Tâche",
                  "raison",
                  "montant (CHF)",
                  "statut",
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
                  repair.length > 0 &&
                  dynamicSearch()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((repair) => (
                      <TableRow key={repair._id}>
                        <TableCell component="th" scope="row">
                          {repair._id}
                        </TableCell>
                        <TableCell>
                          {repair.taskid.title + " - " + repair.taskid.content}
                        </TableCell>
                        <TableCell>
                          {editing && data === repair._id ? (
                            <TextField
                              id={repair.reason}
                              type="text"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              placeholder="Raison"
                            />
                          ) : (
                            repair.reason
                          )}
                        </TableCell>
                        <TableCell>
                          {editing && data === repair._id ? (
                            <TextField
                              id={repair.amount.toString()}
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="Montant"
                            />
                          ) : (
                            repair.amount
                          )}
                        </TableCell>
                        <TableCell>
                          {editing && data === repair._id ? (
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
                            repair.status.name
                          )}
                        </TableCell>
                        <TableCell>
                          {moment(repair.createdAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell>
                          {moment(repair.updatedAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell>
                          {editing && data === repair._id ? (
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
                              <RepairHistory
                                data={repair._id}
                                setError={setError}
                              />
                              <IconButton>
                                <EditIcon
                                  onClick={() => {
                                    setAmount(repair.amount);
                                    setReason(repair.reason);
                                    setStatusid(repair.status._id);
                                    setTask(repair.taskid._id);
                                    setData(repair._id);
                                    setError("");
                                    setSuccess("");
                                    setEditing(!editing);
                                  }}
                                />
                              </IconButton>
                              <DeleteRepair
                                data={repair}
                                setSuccess={setSuccess}
                                setError={setError}
                              />
                            </Fragment>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <LoadingScreen />
                  </TableRow>
                )}
              </Fragment>
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={repair && dynamicSearch().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <div style={{ marginTop: "13px" }}>
        <AddRepair />
      </div>
    </div>
  );
};

export default Repair;
