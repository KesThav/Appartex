import React, { useState, useContext, useEffect } from "react";
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
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddTenant from "../../components/AddTenant";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: "100%",
    height: "60vh",
    overflowY: "scroll",
  },
  header: {
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
  },
  box: {
    display: "flex",
    flexDirection: "row-reverse",
  },
}));
const Tenant = () => {
  const {
    tenant,
    setTenant,
    getTenant,
    loading,
    setLoading,
    authAxios,
  } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");

  const classes = useStyles();
  useEffect(() => {
    getTenant();
  }, []);

  const DeleteTenant = (tenantid) => {
    setLoading(true);
    try {
      authAxios.delete(`tenants/delete/${tenantid}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <AddTenant />
      <TableContainer className={classes.table}>
        <Table stickyHeader>
          <TableHead style={{ background: "#fff" }}>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Né le</TableCell>
              <TableCell>Créé le</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenant &&
              tenant.map((tenant, index) => (
                <TableRow key={tenant._id}>
                  <TableCell component="th" scope="row">
                    {tenant.lastname}
                  </TableCell>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>{tenant.status}</TableCell>
                  <TableCell>
                    {moment(tenant.dateofbirth).format("LL")}
                  </TableCell>
                  <TableCell>{moment(tenant.createdAt).format("LL")}</TableCell>
                  <TableCell>
                    <Button>
                      <EditIcon />
                    </Button>
                    <Button>
                      <DeleteIcon
                        onClick={() => {
                          setData(tenant);
                          setOpen(!open);
                        }}
                      />
                    </Button>{" "}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogContent>{`Êtez-vous sûr de vouloir supprimer le locataire ${data.lastname} ${data.name} ? La suppression est irréversible.`}</DialogContent>
        <Box className={classes.box}>
          <Button
            className={classes.button}
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            Retour
          </Button>

          <Button
            onClick={() => DeleteTenant(data._id)}
            color="primary"
            className={classes.button}
          >
            Valider
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default Tenant;
