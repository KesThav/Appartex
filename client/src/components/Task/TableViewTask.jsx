import React, { useState, useContext, useEffect, Fragment } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  Box,
  TextField,
  Paper,
  Button,
} from "@material-ui/core";

import moment from "moment";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import ExpandMessage from "./ExpandMessage";
import TaskHistory from "./TaskHistory";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    height: "60vh",
    color: "#fff",
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
const Task = ({ setError, setSuccess, task }) => {
  const classes = useStyles();
  const { setLoading, authAxios, loading, setCount } = useContext(UserContext);
  const [data, setData] = useState("");
  const [adress, setAdress] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [city, setCity] = useState("");
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const updatedata = {
      city,
      adress,
      postalcode,
    };
    try {
      await authAxios.put(`/buildings/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setCount((count) => count + 1);
      setSuccess("Immeuble modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const dynamicSearch = () => {
    if (task)
      return task.filter(
        (name) =>
          name._id
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          name.messageid._id.toString().includes(search.toString()) ||
          name.status.name.toLowerCase().includes(search.toLowerCase()) ||
          name.content.toLowerCase().includes(search.toLowerCase()) ||
          name.title.toLowerCase().includes(search.toLowerCase())
      );
  };

  return (
    <div>
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
          <TableHead>
            <TableRow>
              <Fragment>
                {[
                  "Tâche n°",
                  "Titre",
                  "Contenu",
                  "message n°",
                  "statut",
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
            {!loading ? (
              task.length > 0 &&
              dynamicSearch().map((task) => (
                <TableRow key={task._id}>
                  <TableCell component="th" scope="row">
                    {task._id}
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.content}</TableCell>
                  <TableCell>
                    <ExpandMessage id={task.messageid._id} />
                  </TableCell>
                  <TableCell>{task.status.name}</TableCell>
                  <TableCell>
                    {moment(task.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {moment(task.updatedAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    <Fragment>
                      <TaskHistory data={task._id} />
                      <EditTask
                        setSuccess={setSuccess}
                        setError={setError}
                        appointmentData={task}
                      />
                      <DeleteTask
                        id={task._id}
                        setSuccess={setSuccess}
                        setError={setError}
                      />
                    </Fragment>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <LoadingScreen />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "13px" }}></div>
    </div>
  );
};

export default Task;
