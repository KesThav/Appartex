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
  TablePagination,
} from "@material-ui/core";
import DeleteStatus from "../../components/Status/DeleteStatus";
import EditIcon from "@material-ui/icons/Edit";
import AddStatus from "../../components/Status/AddStatus";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Prompt } from "react-router-dom";

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
    padding: 20,
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
const Status = () => {
  const {
    status,
    getStatus,
    setLoading,
    authAxios,
    loading,
    count,
    setCount,
  } = useContext(UserContext);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
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
  }, [count]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const updatedata = {
      name,
    };
    try {
      await authAxios.put(`/status/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setCount((count) => count + 1);
      setSuccess("Statut modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const dynamicSearch = () => {
    if (status)
      return status.filter(
        (name) =>
          name._id
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          name.name
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase())
      );
  };

  return (
    <div>
      <Prompt
        when={editing}
        message="Vous avez des changements non enregitrés, êtes-vous sûr de vouloir quitter la page ?"
      />
      <Typography variant="h3">Les statuts</Typography>
      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
      <Paper>
        <Box className={classes.box3}>
          <TextField
            variant="outlined"
            id="search"
            type="text"
            value={search}
            placeholder="Chercher"
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
            <TableHead>
              <TableRow>
                <Fragment>
                  {["Nom", "Créé le", "Dernière modification", "Actions"].map(
                    (title, index) => (
                      <TableCell key={index}>
                        <strong>{title}</strong>
                      </TableCell>
                    )
                  )}
                </Fragment>
              </TableRow>
            </TableHead>
            <TableBody>
              <Fragment>
                {!loading ? (
                  status.length > 0 &&
                  dynamicSearch()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((status) => (
                      <TableRow key={status._id}>
                        <TableCell component="th" scope="row">
                          {editing && data === status._id ? (
                            <TextField
                              id={status.name}
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Statut"
                            />
                          ) : (
                            status.name
                          )}
                        </TableCell>
                        <TableCell>
                          {moment(status.createdAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell>
                          {moment(status.updatedAt).format("DD/MM/YY")}
                        </TableCell>
                        <TableCell>
                          {editing && data === status._id ? (
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
                              <IconButton>
                                <EditIcon
                                  onClick={() => {
                                    setName(status.name);
                                    setData(status._id);
                                    setError("");
                                    setSuccess("");
                                    setEditing(!editing);
                                  }}
                                />
                              </IconButton>
                              <DeleteStatus
                                data={status}
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
          count={status && status.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <div style={{ marginTop: "13px" }}>
        <AddStatus />
      </div>
    </div>
  );
};

export default Status;
