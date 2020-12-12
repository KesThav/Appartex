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
  Checkbox,
  TablePagination,
} from "@material-ui/core";

import moment from "moment";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import ExpandMessage from "./ExpandMessage";
import TaskHistory from "./TaskHistory";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { TaskToExcel } from "../../pages/ownerpages/export";

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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event, filter) => {
    let newData = filter.map((data) => data._id);
    setActiveFilter(newData);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const dynamicSearch = () => {
    if (task)
      return task
        .filter((data) =>
          activeFilter.length == 0
            ? data
            : activeFilter.includes(data.status._id)
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

  return (
    <div>
      {task && <TaskToExcel dynamicSearch={dynamicSearch()} />}
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
          <Table stickyHeader style={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <Fragment>
                  {[
                    "Titre",
                    "Contenu",
                    "Message n°",
                    "Statut",
                    "Date de début",
                    "Date de fin",
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
                dynamicSearch()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.content}</TableCell>
                      <TableCell>
                        {task.messageid ? (
                          <ExpandMessage
                            id={task.messageid._id}
                            setError={setError}
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>{task.status.name}</TableCell>
                      <TableCell>
                        {moment(task.startDate).format("DD/MM/YY HH:MM")}
                      </TableCell>
                      <TableCell>
                        {moment(task.endDate).format("DD/MM/YY HH:MM")}
                      </TableCell>
                      <TableCell>
                        {moment(task.createdAt).format("DD/MM/YY")}
                      </TableCell>
                      <TableCell>
                        {moment(task.updatedAt).format("DD/MM/YY")}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dynamicSearch().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <div style={{ marginTop: "13px" }}></div>
    </div>
  );
};

export default TaskViewTask;
