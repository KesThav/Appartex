import React, { useState, useContext, useEffect } from "react";
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
  Button,
} from "@material-ui/core";
import { UserContext } from "../middlewares/ContextAPI";
import moment from "moment";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "30vh",
    display: "flex",
    height: "30vh",
    marginRight: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  paper2: {
    width: "40vw",
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
}));

const UserSkeleton = (props) => {
  const classes = useStyles();
  const { authAxios, setLoading } = useContext(UserContext);

  console.log(props.match.params.tenantid);

  const [tenant, setTenant] = useState(null);
  const [bills, setBills] = useState(null);
  const [contract, setContracts] = useState(null);

  const getTenants = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get(
        `/tenants/${props.match.params.tenantid}`
      );
      setTenant(res.data);
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

  useEffect(() => {
    getTenants();
    getBills();
    getContracts();
  }, []);

  return (
    <div>
      <Container>
        <Button
          startIcon={<KeyboardBackspaceIcon />}
          className={classes.button}
        >
          <Link to="/tenants" className={classes.link}>
            Retour aux locataires
          </Link>
        </Button>
        <Grid container>
          <Grid item>
            <Paper className={classes.paper}>
              {" "}
              <Avatar className={classes.avatar}>
                <Typography variant="h3">
                  {" "}
                  {tenant &&
                    tenant.name.charAt(0).toUpperCase() +
                      tenant.lastname.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
              <Typography variant="h3">
                {tenant && tenant.name + " " + tenant.lastname}
              </Typography>
              <Typography variant="overline">
                Créé le{" "}
                {tenant && moment(tenant.createdAt).format("YYYY-MM-DD")}
              </Typography>
              <Typography variant="caption">
                {tenant && tenant.email}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
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
                          ].map((data) => (
                            <TableCell>{data}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contract &&
                          contract.map((data) => (
                            <TableRow>
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
                          ].map((data) => (
                            <TableCell>{data}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bills &&
                          bills.map((data) => (
                            <TableRow>
                              <TableCell>{data._id}</TableCell>
                              <TableCell>{data.reference}</TableCell>
                              <TableCell>{data.reason}</TableCell>
                              <TableCell>{data.amount}</TableCell>
                              <TableCell>{data.status.name}</TableCell>
                              <TableCell>
                                {moment(data.updatedAt).format("YYYY-MM-DD")}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default UserSkeleton;
