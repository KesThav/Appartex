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
  Chip,
  Typography,
  IconButton,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Prompt } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import AddAppart from "../../components/Appart/AddAppart";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import LoadingScreen from "../../components/LoadingScreen";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import DeleteAppart from "../../components/Appart/DeleteAppart";
import ShowDocument from "../../components/Appart/AppartDocumentSkeleton";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
}));
const Appart = () => {
  const {
    appart,
    getApparts,
    setLoading,
    authAxios,
    loading,
    count,
    setCount,
    building,
    getBuildings,
  } = useContext(UserContext);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [size, setSize] = useState(null);
  const [adress, setAdress] = useState(null);
  const [postalcode, setPostalcode] = useState(-1);
  const [city, setCity] = useState(null);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [build, setBuild] = useState(null);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("");
  const [check, setCheck] = useState(false);
  const [activeFilter, setActiveFilter] = useState([]);
  const [optionValue, setOptionValue] = useState();

  const classes = useStyles();
  useEffect(() => {
    getBuildings();
    getApparts();
  }, [count]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const updatedata = {
      size,
      city,
      adress,
      postalcode,
      building: build,
    };
    try {
      await authAxios.put(`/appartments/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setCount((count) => count + 1);
      setSuccess("Appartement modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const statut = [
    { value: "", label: "Tout" },
    { value: "Libre", label: "Libre" },
    { value: "Occupé", label: "Occupé" },
  ];

  const handleChange = (event, filter) => {
    let newData = filter.map((data) => data._id);
    setActiveFilter(newData);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const dynamicSearch = () => {
    if (appart) {
      return appart
        .filter((data) => (check == true ? !data.building : data))
        .filter((data) => {
          if (data.building) {
            if (activeFilter.length == 0) {
              return appart;
            } else {
              return activeFilter.includes(data.building._id);
            }
          } else {
            if (activeFilter.length == 0) {
              return appart;
            } else {
              return activeFilter.includes(data.building);
            }
          }
        })
        .filter((data) =>
          data.building
            ? data.building._id.includes(filter)
            : data.adress.includes(filter)
        )
        .filter((data) => data.status.includes(status))
        .filter((name) =>
          !name.building
            ? name._id
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              name.postalcode
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              name.adress.toLowerCase().includes(search.toLowerCase()) ||
              name.city.toLowerCase().includes(search.toLowerCase()) ||
              name.size
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              name.status
                .toLowerCase()
                .includes(search.toString().toLowerCase())
            : name._id
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              name.building.postalcode
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              name.building.adress
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              name.building.city.toLowerCase().includes(search.toLowerCase()) ||
              name.size
                .toString()
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              name.status
                .toLowerCase()
                .includes(search.toString().toLowerCase())
        );
    }
  };
  return (
    <div>
      <Prompt
        when={editing}
        message="You avez des changements non enregitrés, est-ce sûr de vouloir quitter la page ?"
      />
      <Typography variant="h3">Les appartements</Typography>
      <div style={{ marginBottom: "10px" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </div>
      <Paper>
        <Box className={classes.box3}>
          {building && (
            <Autocomplete
              multiple
              options={building}
              disableCloseOnSelect
              getOptionLabel={(option) =>
                option.adress + " " + option.postalcode + " " + option.city
              }
              onChange={handleChange}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.adress + " " + option.postalcode + " " + option.city}
                </React.Fragment>
              )}
              style={{ width: "30%", marginRight: "20px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Filter par immeuble"
                />
              )}
            />
          )}
          <TextField
            style={{ width: "10%", marginRight: "20px" }}
            label="Statut"
            id="statut"
            select
            variant="outlined"
            onChange={(e) => setStatus(e.target.value)}
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
          <FormControl
            component="fieldset"
            className={classes.formControl}
            style={{ display: "flex", flexDirection: "row", padding: 5 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={check}
                  name={check}
                  onChange={() => setCheck(!check)}
                />
              }
              label={"Afficher que les appartements solitaires"}
            />
          </FormControl>
        </Box>

        <TableContainer className={classes.table} component={Paper} square>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Appartient à un immeuble ?",
                  "Adresse",
                  "Code postale",
                  "Ville",
                  "Pièces",
                  "Statut",
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
                  appart.length > 0 &&
                  dynamicSearch().map((appart) => {
                    return !appart.building ? (
                      <TableRow key={appart._id}>
                        <TableCell component="th" scope="row">
                          {appart.building ? "Oui" : "Non"}
                        </TableCell>
                        <TableCell>
                          {editing && data === appart._id ? (
                            <TextField
                              id={appart.adress}
                              type="text"
                              value={adress}
                              onChange={(e) => setAdress(e.target.value)}
                              placeholder="Adresse"
                            />
                          ) : (
                            appart.adress
                          )}
                        </TableCell>
                        <TableCell>
                          {editing && data === appart._id ? (
                            <TextField
                              id={appart.postalcode.toString()}
                              type="number"
                              value={postalcode}
                              onChange={(e) => setPostalcode(e.target.value)}
                              placeholder="Code postale"
                            />
                          ) : (
                            appart.postalcode
                          )}
                        </TableCell>
                        <TableCell>
                          {editing && data === appart._id ? (
                            <TextField
                              id={appart.city}
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="Ville"
                            />
                          ) : (
                            appart.city
                          )}
                        </TableCell>
                        <TableCell>
                          {editing && data === appart._id ? (
                            <TextField
                              id={appart.size.toString()}
                              type="number"
                              value={size}
                              onChange={(e) => setSize(e.target.value)}
                              placeholder="Pièces"
                            />
                          ) : (
                            appart.size
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            {appart.status == "Libre" ? (
                              <Chip
                                style={{ background: "#52b202", color: "#fff" }}
                                label={appart.status}
                              />
                            ) : (
                              <Chip
                                style={{ background: "red", color: "#fff" }}
                                label={appart.status}
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {moment(appart.createdAt).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell>
                          {moment(appart.updatedAt).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell>
                          {editing && data === appart._id ? (
                            <Fragment>
                              <Button>
                                <CheckIcon onClick={submit} />
                              </Button>
                              <Button>
                                <CloseIcon
                                  onClick={() => setEditing(!editing)}
                                />
                              </Button>
                            </Fragment>
                          ) : (
                            <Fragment>
                              {appart.picture.length > 0 && (
                                <ShowDocument
                                  appart={appart._id}
                                  setError={setError}
                                />
                              )}
                              <IconButton>
                                <EditIcon
                                  onClick={() => {
                                    setSize(appart.size);
                                    setAdress(appart.adress);
                                    setPostalcode(appart.postalcode);
                                    setCity(appart.city);
                                    setData(appart._id);
                                    setBuild(null);
                                    setError("");
                                    setSuccess("");
                                    setEditing(!editing);
                                  }}
                                />
                              </IconButton>
                              <DeleteAppart
                                data={appart}
                                setSuccess={setSuccess}
                                setError={setError}
                              />
                            </Fragment>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={appart._id}>
                        <TableCell>{appart.building ? "Oui" : "Non"}</TableCell>
                        <TableCell>{appart.building.adress}</TableCell>
                        <TableCell>{appart.building.postalcode}</TableCell>
                        <TableCell>{appart.building.city}</TableCell>
                        <TableCell>
                          {editing && data === appart._id ? (
                            <TextField
                              id={appart.size.toString()}
                              type="number"
                              value={size}
                              onChange={(e) => setSize(e.target.value)}
                              placeholder="Pièces"
                            />
                          ) : (
                            appart.size
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            {appart.status == "Libre" ? (
                              <Chip
                                style={{ background: "#52b202", color: "#fff" }}
                                label={appart.status}
                              />
                            ) : (
                              <Chip
                                style={{ background: "red", color: "#fff" }}
                                label={appart.status}
                              />
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          {moment(appart.createdAt).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell>
                          {moment(appart.updatedAt).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell>
                          {editing && data === appart._id ? (
                            <Fragment>
                              <Button>
                                <CheckIcon onClick={submit} />
                              </Button>
                              <Button>
                                <CloseIcon
                                  onClick={() => setEditing(!editing)}
                                />
                              </Button>
                            </Fragment>
                          ) : (
                            <Fragment>
                              {appart.picture.length > 0 && (
                                <ShowDocument appart={appart._id} />
                              )}

                              <IconButton>
                                <EditIcon
                                  onClick={() => {
                                    setSize(appart.size);
                                    setAdress("");
                                    setPostalcode("");
                                    setCity("");
                                    setData(appart._id);
                                    setBuild(appart.building._id);
                                    setError("");
                                    setSuccess("");
                                    setEditing(!editing);
                                  }}
                                />
                              </IconButton>
                              <DeleteAppart
                                data={appart}
                                setSuccess={setSuccess}
                                setError={setError}
                              />
                            </Fragment>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <LoadingScreen />
                  </TableRow>
                )}
              </Fragment>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div style={{ marginTop: "13px" }}>
        <AddAppart />
      </div>
    </div>
  );
};

export default Appart;
