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

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    flexDirection: "column",
  },
  paper: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
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
  const [doc, setDoc] = useState("");

  const getBills = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/tenants/bills/${user._id}`);
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
      const res = await authAxios.get(`/tenants/contracts/${user._id}`);
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
      const res = await authAxios.get(`/tenants/tasks/${user._id}`);
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getTenantFile = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/tenants/${user._id}`);
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
        await authAxios.put(`/tenants/update/${user._id}`, updatedata);
        await authAxios.put(`/tenants/update/password/${user._id}`, {
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
    getBills();
    getContracts();
    getTasks();
    getTenantFile();
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  }, [count]);

  return (
    <Fragment>
      <Container maxWidthLg>
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
              {user && user.name + " " + user.lastname}
            </Typography>
            <Typography variant="overline">
              Créé le {user && moment(user.createdAt).format("DD/MM/YY")}
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
                      <TableBody>
                        {contract.length > 0 &&
                          contract.map((data) => (
                            <TableRow key={data._id}>
                              <TableCell>{data.adress}</TableCell>
                              <TableCell>{data.charge}</TableCell>
                              <TableCell>{data.rent}</TableCell>
                              <TableCell>{data.status}</TableCell>
                              <TableCell>
                                {moment(data.createdAt).format("DD/MM/YY")}
                              </TableCell>
                              <TableCell>
                                {data.file.map((doc) => (
                                  <Fragment>
                                    <a href={doc.data} download={doc.name}>
                                      {doc.name}
                                    </a>
                                    <br />
                                  </Fragment>
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
                              <TableCell>{data.reference}</TableCell>
                              <TableCell>{data.reason}</TableCell>
                              <TableCell>{data.amount}</TableCell>
                              <TableCell>{data.status.name}</TableCell>
                              <TableCell>
                                {moment(data.endDate).format("DD/MM/YY")}
                              </TableCell>
                              <TableCell>
                                {data.file.map((doc) => (
                                  <Fragment>
                                    <a href={doc.data} download={doc.name}>
                                      {doc.name}
                                    </a>
                                    <br />
                                  </Fragment>
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
