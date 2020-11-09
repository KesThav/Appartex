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
  Box,
  TextField,
  Paper,
  MenuItem,
  Typography,
  Divider,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import AddRepair from "../../components/Repair/AddRepair";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteRepair from "../../components/Repair/DeleteRepair";
import RepairHistory from "../../components/Repair/RepairHistory";

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

  const classes = useStyles();
  useEffect(() => {
    getRepairs();
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

  const dynamicSearch = () => {
    if (repair) {
      return repair.filter(
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
      <Typography variant="h3" color="primary">
        Les Reparations
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
              {[
                "Réparation n°",
                "Tâche n°",
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
                dynamicSearch().map((repair) => (
                  <TableRow key={repair._id}>
                    <TableCell component="th" scope="row">
                      {repair._id}
                    </TableCell>
                    <TableCell>{repair.taskid._id}</TableCell>
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
                          className={classes.form}
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
                      {moment(repair.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {moment(repair.updatedAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {editing && data === repair._id ? (
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
                          <RepairHistory data={repair._id} />
                          <Button>
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
                          </Button>
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
      <div style={{ marginTop: "13px" }}>

      </div>
    </div>
  );
};

export default Repair;
