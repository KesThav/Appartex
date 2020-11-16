import React, { useState, useContext, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  Paper,
  Box,
  Typography,
  Container,
  Grid,
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
import { UserContext } from "../middlewares/ContextAPI";
import moment from "moment";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Alert from "@material-ui/lab/Alert";
import PersonIcon from "@material-ui/icons/Person";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

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
  },
  avatar: {
    height: 100,
    width: 100,
    backgroundColor: [theme.palette.primary.light],
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

const UserSkeleton = (props) => {
  const classes = useStyles();
  const { authAxios, setLoading } = useContext(UserContext);
  const [tenant, setTenant] = useState("");
  const [bills, setBills] = useState("");
  const [contract, setContracts] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dateofbirth, setDate] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [count, setCount] = useState(0);

  const getTenants = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(`tenants/${props.match.params.tenantid}`);
      setTenant(res.data);
      setName(res.data.name);
      setLastname(res.data.lastname);
      setEmail(res.data.email);
      setDate(res.data.dateofbirth);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getBills = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(
        `tenants/bills/${props.match.params.tenantid}`
      );
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
      const res = await authAxios.get(
        `tenants/contracts/${props.match.params.tenantid}`
      );
      setContracts(res.data);
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
        await authAxios.put(
          `/tenants/update/${props.match.params.tenantid}`,
          updatedata
        );
        await authAxios.put(
          `/tenants/update/password/${props.match.params.tenantid}`,
          {
            password: password,
          }
        );
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
    getTenants();
  }, [count]);

  return (
    <Fragment>
      <Container>
        <Button
          startIcon={<KeyboardBackspaceIcon />}
          className={classes.button}
        >
          <Link to="/tenants" className={classes.link}>
            Retour aux locataires
          </Link>
        </Button>
        {err && <Alert severity="error">{err}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box className={classes.flex}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonIcon style={{ fontSize: 85 }} />
            </Avatar>
            <Typography variant="h3">
              {tenant && tenant.name + " " + tenant.lastname}
            </Typography>
            <Typography variant="overline">
              Créé le {tenant && moment(tenant.createdAt).format("YYYY-MM-DD")}
            </Typography>
            <Typography variant="caption">{tenant && tenant.email}</Typography>
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
            </div>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default UserSkeleton;
