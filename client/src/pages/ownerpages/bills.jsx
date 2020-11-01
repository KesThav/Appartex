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
  Dialog,
  DialogContent,
  Box,
  TextField,
  DialogTitle,
  List,
  ListItem,
  Paper,
  Chip,
  Typography,
  Divider,
  MenuItem,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddBills from "../../components/AddBills";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import HistoryIcon from "@material-ui/icons/History";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    height: "60vh",
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
}));
const Bills = () => {
  const {
    bill,
    tenant,
    status,
    getBills,
    getTenants,
    getStatus,
    setLoading,
    authAxios,
  } = useContext(UserContext);
  const [deleteShow, setDeleteShow] = useState(false);
  const [historyShow, setHistoryShow] = useState(false);
  const [data, setData] = useState("");
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [tenantid, setTenantid] = useState("");
  const [statusid, setStatusid] = useState("");
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [billhistory, setBillhistory] = useState("");

  const classes = useStyles();
  useEffect(() => {
    getTenants();
    getStatus();
    getBills();
  }, [bill]);

  const DeleteBill = (billid) => {
    setLoading(true);
    try {
      authAxios.delete(`bills/delete/${billid}`);
      setLoading(false);
      setDeleteShow(!deleteShow);
      setSuccess("Facture supprimé avec succès");
    } catch (err) {
      setDeleteShow(!deleteShow);
      console.log(err);
      setLoading(false);
    }
  };

  const getBillHistories = async (billid) => {
    setLoading(true);
    try {
      const res = await authAxios.get(`/history/bills/${billid}`);
      setBillhistory(res.data);
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
    const updatedata = {
      reference,
      reason,
      tenant: tenantid,
      status: statusid,
      endDate,
      amount,
    };
    try {
      await authAxios.put(`/bills/update/${data}`, updatedata);
      setLoading(false);
      setEditing(false);
      setSuccess("Immeuble modifié avec succès");
    } catch (err) {
      setLoading(false);
      setError(err.response.data);
    }
  };

  const dynamicSearch = () => {
    if (bill) {
      return bill.filter(
        (name) =>
          name._id
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          name.tenant.name.toLowerCase().includes(search.toLowerCase()) ||
          name.tenant.lastname.toLowerCase().includes(search.toLowerCase()) ||
          name.reference
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          name.amount
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          name.reason.toLowerCase().includes(search.toLowerCase()) ||
          name.status.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  };
  return (
    <div>
      <Typography variant="h4" color="primary">
        Les Factures
      </Typography>
      <Divider className={classes.divider} />
      {err && <Alert severity="error">{err}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

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
          style={{ width: "20%" }}
        />
      </Box>
      <TableContainer className={classes.table} component={Paper} square>
        <Table stickyHeader>
          <TableHead style={{ background: "#fff" }}>
            <TableRow>
              {[
                "Facture n°",
                "Locataire",
                "Référence",
                "Raison",
                "Montant",
                "Statut",
                "Echéance",
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
              {bill.length > 0 &&
                dynamicSearch().map((bill) => (
                  <TableRow key={bill._id}>
                    <TableCell>{bill._id}</TableCell>
                    <TableCell>
                      {bill.tenant.name + " " + bill.tenant.lastname}
                    </TableCell>
                    <TableCell>{bill.reference}</TableCell>
                    <TableCell>{bill.reason}</TableCell>
                    <TableCell>{bill.amount}</TableCell>
                    <TableCell>
                      {editing && data === bill._id ? (
                        <TextField
                          id="Status"
                          select
                          value={statusid}
                          onChange={(e) => setStatusid(e.target.value)}
                          fullWidth
                          className={classes.form}
                        >
                          {status &&
                            status.map((option) => (
                              <MenuItem key={option._id} value={option._id}>
                                {option.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      ) : (
                        bill.status.name
                      )}
                    </TableCell>

                    <TableCell>
                      {moment(bill.endDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {moment(bill.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {moment(bill.updateddAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {editing && data === bill._id ? (
                        <Fragment>
                          <Button>
                            <CheckIcon onClick={submit} />
                          </Button>
                          <Button>
                            <CloseIcon onClick={() => setEditing(!editing)} />
                          </Button>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <Button>
                            <HistoryIcon
                              onClick={() => {
                                getBillHistories(bill._id);
                                setHistoryShow(!historyShow);
                              }}
                            />
                          </Button>
                          <Button>
                            <EditIcon
                              onClick={() => {
                                setReference(bill.reference);
                                setAmount(bill.amount);
                                setReason(bill.reason);
                                setTenantid(bill.tenant._id);
                                setStatusid(bill.status._id);
                                setEndDate(moment(bill.endDate));
                                setData(bill._id);
                                setError("");
                                setSuccess("");
                                setEditing(!editing);
                              }}
                            />
                          </Button>
                          <Button>
                            <DeleteIcon
                              onClick={() => {
                                setData(bill);
                                setDeleteShow(!deleteShow);
                              }}
                            />
                          </Button>{" "}
                        </Fragment>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </Fragment>
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "13px" }}>
        <AddBills />
      </div>
      <Dialog
        open={deleteShow}
        onClose={() => setDeleteShow(!deleteShow)}
        disableBackdropClick
      >
        <DialogTitle>Supprimer un Immeuble</DialogTitle>
        <DialogContent>
          {" "}
          <DialogContent>
            Êtez-vous sûr de vouloir supprimer la facture
            <br />
            <strong>{data._id}</strong> ? <br />
            Une fois validé, il n'est plus possible de revenir en arrière.
          </DialogContent>
        </DialogContent>
        <Box className={classes.box}>
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => setDeleteShow(!deleteShow)}
          >
            Retour
          </Button>

          <Button
            onClick={() => DeleteBill(data._id)}
            color="primary"
            className={classes.button}
          >
            Valider
          </Button>
        </Box>
      </Dialog>

      {billhistory && (
        <Dialog
          open={historyShow}
          onClose={() => setDeleteShow(!deleteShow)}
          disableBackdropClick
        >
          <DialogTitle>Historique</DialogTitle>
          <DialogContent>
            <Table>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
              {billhistory.map((bh) => (
                <TableRow>
                  <TableCell>
                    {moment(bh.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>{bh.status.name}</TableCell>
                </TableRow>
              ))}
            </Table>
          </DialogContent>
          <Box className={classes.box}>
            <Button
              className={classes.button}
              color="inherit"
              onClick={() => setHistoryShow(!historyShow)}
            >
              Retour
            </Button>

            <Button
              onClick={() => DeleteBill(data._id)}
              color="primary"
              className={classes.button}
            >
              Valider
            </Button>
          </Box>
        </Dialog>
      )}
    </div>
  );
};

export default Bills;
