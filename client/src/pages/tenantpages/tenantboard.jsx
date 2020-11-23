import React, { useState, useContext, useEffect, Fragment } from "react";
import Schedule from "../../components/Schedule";
import {
  makeStyles,
  Paper,
  Box,
  Typography,
  Container,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TextField,
  Divider,
  Button,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import moment from "moment";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Alert from "@material-ui/lab/Alert";
import PersonIcon from "@material-ui/icons/Person";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    flexDirection: "column",
  },
  paper: {
    width: "40%",
    display: "flex",
    height: "30vh",
    marginRight: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginRight: 20,
    textAlign: "center",
  },
  avatar: {
    height: 100,
    width: 100,
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
  button: {
    marginBottom: 10,
  },
  link: {
    textDecoration: "none",
    color: "#000000",
  },
  details: {
    marginBottom: 10,
    padding: 10,
  },
  form: {
    marginTop: 20,
    marginBottom: 10,
  },
  field: {
    width: "45%",
    marginRight: 10,
    marginBottom: 25,
  },
  box: {
    marginTop: 10,
    width: "98%",
    display: "flex",
    flexDirection: "row-reverse",
  },
}));

const Tenantboard = (props) => {
  const classes = useStyles();
  const { authAxios, setLoading, user } = useContext(UserContext);
  const [bills, setBills] = useState("");
  const [contract, setContracts] = useState("");
  const [task, setTasks] = useState("");
  const [name, setName] = useState(user.name);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dateofbirth, setDate] = useState(user.dateofbirth);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [count, setCount] = useState(0);

  const getBills = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`tenants/bills/${user._id}`);
      setBills(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getContracts = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`tenants/contracts/${user._id}`);
      setContracts(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getTasks = async () => {
    try {
      const res = await authAxios.get(`tenants/tasks/${user._id}`);
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!dateofbirth) {
      setDate(moment().format("YYYY-MM-DD"));
    }
    if (!name || !lastname || !email || !password || !confirm) {
      setError("Complétez tous les champs");
    } else if (password !== confirm) {
      setError("Les mot de passes ne correspondent pas");
    } else if (password.length < 6) {
      setError("Le mot de passe doit faire minimum 6 charactères");
    } else {
      const updatedata = {
        name,
        lastname,
        email,
        dateofbirth,
      };
      try {
        await authAxios.put(`/tenants/update/${user._id}`, updatedata);
        await authAxios.put(`/tenants/update/password/${user._id}`, {
          password: password,
        });
        setLoading(false);
        setSuccess("Locataire modifié avec succès");
        setCount((count) => count + 1);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  useEffect(() => {
    getBills();
    getContracts();
    getTasks();
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }, [count]);

  return (
    <Fragment>
      <Container maxWidthLg>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box className={classes.flex}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonIcon style={{ fontSize: 85 }} />
            </Avatar>
            <Typography variant="h3">
              {user && user.name + " " + user.lastname}
            </Typography>
            <Typography variant="overline">
              Créé le {user && moment(user.createdAt).format("YYYY-MM-DD")}
            </Typography>
            <Typography variant="caption">{user && user.email}</Typography>
          </Paper>

          <Box className={classes.flex3}>
            <Paper className={classes.details}>
              <Typography variant="h6">
                <strong>Profil</strong>
              </Typography>
              <Divider />
              <form className={classes.form} onSubmit={submit}>
                <TextField
                  variant="outlined"
                  label="Prénom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={classes.field}
                />

                <TextField
                  variant="outlined"
                  label="Nom"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className={classes.field}
                />
                <TextField
                  variant="outlined"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={classes.field}
                />
                <TextField
                  variant="outlined"
                  label="Email"
                  type="date"
                  value={moment(dateofbirth).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setDate(moment(e.target.value).format("YYYY-MM-DD"))
                  }
                  className={classes.field}
                />
                <TextField
                  variant="outlined"
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={classes.field}
                />
                <TextField
                  variant="outlined"
                  label="Confirmer le mot de passe"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={classes.field}
                />
                <Box className={classes.box}>
                  <Button color="primary" variant="contained" type="submit">
                    Enregistrer les changements
                  </Button>
                </Box>
              </form>
            </Paper>
            <div>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Les contrats
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {[
                            "Contrat n°",
                            "Adresse",
                            "Charge",
                            "Loyer",
                            "Statut",
                            "Date",
                            "Documents",
                          ].map((data, index) => (
                            <TableCell key={index}>
                              <strong>{data}</strong>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contract.length > 0 &&
                          contract.map((data) => (
                            <TableRow key={data._id}>
                              <TableCell>{data._id}</TableCell>
                              <TableCell>
                                {data.appartmentid.building
                                  ? data.appartmentid.building.adress +
                                    " " +
                                    data.appartmentid.building.postalcode +
                                    " " +
                                    data.appartmentid.building.city
                                  : data.appartmentid.adress}
                              </TableCell>
                              <TableCell>{data.charge}</TableCell>
                              <TableCell>{data.rent}</TableCell>
                              <TableCell>{data.status}</TableCell>
                              <TableCell>
                                {moment(data.updatedAt).format("YYYY-MM-DD")}
                              </TableCell>
                              <TableCell>
                                {data.file.map((doc) => (
                                  <Link
                                    to={`//localhost:5000/${doc}`}
                                    target="_blank"
                                  >
                                    {doc}
                                  </Link>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>
                    Les Factures
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {[
                            "Facture n°",
                            "Référence",
                            "Raison",
                            "Montant",
                            "Statut",
                            "Echéance",
                            "Documents",
                          ].map((data, index) => (
                            <TableCell key={index}>
                              <strong>{data}</strong>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bills.length > 0 &&
                          bills.map((data) => (
                            <TableRow key={data._id}>
                              <TableCell>{data._id}</TableCell>
                              <TableCell>{data.reference}</TableCell>
                              <TableCell>{data.reason}</TableCell>
                              <TableCell>{data.amount}</TableCell>
                              <TableCell>{data.status.name}</TableCell>
                              <TableCell>
                                {moment(data.updatedAt).format("YYYY-MM-DD")}
                              </TableCell>
                              <TableCell>
                                {data.file.map((doc) => (
                                  <Link
                                    to={`//localhost:5000/${doc}`}
                                    target="_blank"
                                  >
                                    {doc}
                                  </Link>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>
                    Les Tâches prévus
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Schedule data={task} />
                </AccordionDetails>
              </Accordion>
            </div>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default Tenantboard;
