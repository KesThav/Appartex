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
import { arrayBufferToBase64 } from "../../components/arrayBufferToBase64";
import { Link } from "react-router-dom";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import LoadingScreen from "../../components/LoadingScreen";

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  paper: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginRight: 0,
      flexWrap: "wrap",
      display: "none",
    },
    width: "40%",
    display: "flex",
    height: "35vh",
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
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  field: {
    width: "45%",
    marginRight: 10,
    marginBottom: 25,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginRight: 0,
    },
  },
  box: {
    marginTop: 10,
    width: "98%",
    display: "flex",
    flexDirection: "row-reverse",
  },
  [theme.breakpoints.down("sm")]: {
    thead: { display: "none" },
    tbody: { display: "block", width: "100%" },
    trow: {
      display: "block",
      width: "100%",
      "&:nth-child(even)": {
        backgroundColor: "#eceff1",
      },
    },
    tcell: {
      overflowWrap: "break-word",
      display: "block",
      width: "100%",
      textAlign: "right",
      paddingLeft: "50%",
      position: "relative",
      "&::before": {
        content: "attr(data-label)",
        position: "absolute",
        left: 5,
        justifyContent: "center",
        fontWeight: "bold",
      },
    },
  },
}));

const Tenantboard = (props) => {
  const classes = useStyles();
  const { authAxios, setLoading, user, loading } = useContext(UserContext);
  const [bills, setBills] = useState("");
  const [contract, setContracts] = useState("");
  const [task, setTasks] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dateofbirth, setDate] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [count, setCount] = useState(0);
  const [doc, setDoc] = useState("");
  const [userToFetch, setUserToFetch] = useState(null);
  const [tenant, setTenant] = useState("");

  const getBills = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/tenants/bills/${userToFetch}`);
      const doc = res.data.map((data) => {
        return {
          _id: data._id,
          reference: data.reference,
          reason: data.reason,
          amount: data.amount,
          status: data.status.name,
          endDate: data.endDate,
          createdAt: data.createdAt,
          file: data.file.map((data) => {
            return {
              data:
                `data:${data.contentType};base64,` +
                arrayBufferToBase64(data.data.data),
              name: data.name,
              _id: data._id,
            };
          }),
        };
      });
      setBills(doc);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getContracts = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/tenants/contracts/${userToFetch}`);
      const doc =
        res &&
        res.data.map((data) => {
          return {
            adress: data.appartmentid.building
              ? data.appartmentid.building.adress +
                " " +
                data.appartmentid.building.postalcode +
                " " +
                data.appartmentid.building.city
              : data.appartmentid.adress,
            _id: data._id,
            charge: data.charge,
            rent: data.rent,
            status: data.status,
            createdAt: data.createdtAt,
            updatedAt: data.updatedAt,
            file: data.file.map((data) => {
              return {
                data:
                  `data:${data.contentType};base64,` +
                  arrayBufferToBase64(data.data.data),
                name: data.name,
                _id: data._id,
              };
            }),
          };
        });
      setContracts(doc);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getTasks = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/tenants/tasks/${userToFetch}`);
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getTenants = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`tenants/${userToFetch}`);
      setTenant(res.data);
      setName(res.data.name);
      setLastname(res.data.lastname);
      setEmail(res.data.email);
      setDate(res.data.dateofbirth);
      setDoc(
        res.data.file.map((data) => {
          return {
            data:
              `data:${data.contentType};base64,` +
              arrayBufferToBase64(data.data.data),
            name: data.name,
            _id: data._id,
          };
        })
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (moment().diff(moment(dateofbirth), "years") < 18) {
      setError(
        "Les changements ne peuvent pas être enregistré car vous n'êtes pas majeur"
      );
    } else if (!name || !lastname || !email || !password || !confirm) {
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
        await authAxios.put(`/tenants/update/${userToFetch}`, updatedata);
        await authAxios.put(`/tenants/update/password/${userToFetch}`, {
          password: password,
        });
        setLoading(false);
        setSuccess("Modifications enregistrées avec succès");
        setCount((count) => count + 1);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  useEffect(() => {
    props.match.params.tenantid
      ? setUserToFetch(props.match.params.tenantid)
      : setUserToFetch(user._id);
    if (userToFetch) {
      getBills();
      getContracts();
      getTasks();
      getTenants();
    }

    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }, [count, userToFetch]);

  return (
    <Fragment>
      {loading && <LoadingScreen />}
      <Container className={classes.container}>
        {user.role == "Admin" && (
          <Button
            startIcon={<KeyboardBackspaceIcon />}
            className={classes.button}
          >
            <Link to="/tenants" className={classes.link}>
              Retour aux locataires
            </Link>
          </Button>
        )}
        <div style={{ marginBottom: "10px" }}>
          {err && <Alert severity="error">{err}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </div>
        <Box className={classes.flex}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonIcon style={{ fontSize: 85 }} />
            </Avatar>

            <Typography variant="h3">
              {name && lastname && name + " " + lastname}
            </Typography>
            <Typography variant="overline">
              Créé le {dateofbirth && moment(dateofbirth).format("DD/MM/YY")}
            </Typography>
            <Typography variant="caption">{email && email}</Typography>
          </Paper>

          <Box>
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
            <div style={{ width: "100%" }}>
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
                      <TableHead className={classes.thead}>
                        <TableRow>
                          {[
                            "Adresse",
                            "Charge",
                            "Loyer",
                            "Statut",
                            "Valable depuis le",
                            "Documents",
                          ].map((data, index) => (
                            <TableCell key={index}>
                              <strong>{data}</strong>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tbody}>
                        {contract.length > 0 &&
                          contract.map((data) => (
                            <TableRow key={data._id} className={classes.trow}>
                              <TableCell
                                data-label="Adresse"
                                className={classes.tcell}
                              >
                                {data.adress}
                              </TableCell>
                              <TableCell
                                data-label="Charge"
                                className={classes.tcell}
                              >
                                {data.charge}
                              </TableCell>
                              <TableCell
                                data-label="Loyer"
                                className={classes.tcell}
                              >
                                {data.rent}
                              </TableCell>
                              <TableCell
                                data-label="Statut"
                                className={classes.tcell}
                              >
                                {data.status}
                              </TableCell>
                              <TableCell
                                data-label="Valable depuis le"
                                className={classes.tcell}
                              >
                                {moment(data.createdAt).format("DD/MM/YY")}
                              </TableCell>
                              <TableCell
                                data-label="Documents"
                                className={classes.tcell}
                              >
                                {data.file.length > 0
                                  ? data.file.map((doc) => (
                                      <Fragment>
                                        <a href={doc.data} download={doc.name}>
                                          {doc.name}
                                        </a>
                                        <br />
                                      </Fragment>
                                    ))
                                  : "-"}
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
                    <Table className={classes.table}>
                      <TableHead className={classes.thead}>
                        <TableRow>
                          {[
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
                      <TableBody className={classes.tbody}>
                        {bills.length > 0 &&
                          bills.map((data) => (
                            <TableRow key={data._id} className={classes.trow}>
                              <TableCell
                                data-label="Référence"
                                className={classes.tcell}
                              >
                                {data.reference}
                              </TableCell>
                              <TableCell
                                data-label="Raison"
                                className={classes.tcell}
                              >
                                {data.reason}
                              </TableCell>
                              <TableCell
                                data-label="Montant"
                                className={classes.tcell}
                              >
                                {data.amount}
                              </TableCell>
                              <TableCell
                                data-label="Statut"
                                className={classes.tcell}
                              >
                                {data.status}
                              </TableCell>
                              <TableCell
                                data-label="Echéance"
                                className={classes.tcell}
                              >
                                {moment(data.endDate).format("DD/MM/YY")}
                              </TableCell>
                              <TableCell
                                data-label="Documents"
                                className={classes.tcell}
                              >
                                {data.file.length > 0
                                  ? data.file.map((doc) => (
                                      <Fragment>
                                        <a href={doc.data} download={doc.name}>
                                          {doc.name}
                                        </a>
                                        <br />
                                      </Fragment>
                                    ))
                                  : "-"}
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
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>
                    Les documents personnels
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {doc &&
                    doc.map((data) => (
                      <TableCell>
                        <a href={data.data} download={data.name}>
                          {data.name}
                        </a>
                      </TableCell>
                    ))}
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
