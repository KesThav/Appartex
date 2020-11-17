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
  MenuItem,
  FormControlLabel,
  FormControl,
  Checkbox,
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
const TaskViewTask = ({ setError, setSuccess, task }) => {
  const classes = useStyles();
  const { loading, status } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState([]);

  const dynamicSearch = () => {
    if (task)
      return task
        .filter((data) =>
          activeFilter.length == 0
            ? activeFilter
            : !activeFilter.includes(data.status._id)
        )
        .filter((data) => data.status.name.includes(filter))
        .filter(
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

  const handleChange = (filter) => {
    if (activeFilter.includes(filter)) {
      const filterIndex = activeFilter.indexOf(filter);
      const newFilter = [...activeFilter];
      newFilter.splice(filterIndex, 1);
      setActiveFilter(newFilter);
    } else {
      setActiveFilter((oldFilter) => [...oldFilter, filter]);
    }
  };

  return (
    <div>
      <Paper>
        <Box className={classes.box3}>
          <TextField
            style={{ width: "10%", marginRight: "20px" }}
            id="Status"
            label="Statut"
            variant="outlined"
            select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            className={classes.form}
          >
            <MenuItem value="">Tout</MenuItem>
            {status &&
              status.map((option) => (
                <MenuItem key={option._id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
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
          <FormControl
            component="fieldset"
            className={classes.formControl}
            style={{ display: "flex", flexDirection: "row", padding: 5 }}
          >
            {status &&
              status.map((data, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={activeFilter.includes(data._id)}
                      name={data._id}
                      onChange={() => handleChange(data._id)}
                    />
                  }
                  label={data.name}
                />
              ))}
          </FormControl>
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
                      <ExpandMessage
                        id={task.messageid._id}
                        setError={setError}
                      />
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
                        <TaskHistory data={task._id} setError={setError} />
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
      </Paper>
      <div style={{ marginTop: "13px" }}></div>
    </div>
  );
};

export default TaskViewTask;
