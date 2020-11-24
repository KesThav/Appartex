import React, { useState, useContext, useEffect, Fragment } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import {
  Paper,
  makeStyles,
  Card,
  Button,
  TextField,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import LoadingScreen from "../LoadingScreen";
import { Link } from "react-router-dom";
import DeleteFile from "./DeleteFile";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    maxWidth: "100%",
  },
  box: {
    marginBottom: 20,
  },
  form: {
    marginBottom: 17,
  },
  box2: {
    display: "flex",
    flexDirection: "row-reverse",
  },
}));

const UploadFile = ({ setSuccess, setError }) => {
  const classes = useStyles();
  const {
    tenant,
    setLoading,
    authAxios,
    getTenants,
    count,
    setCount,
    loading,
  } = useContext(UserContext);
  const [fl, setFl] = useState([]);
  const [tenantid, setTenantid] = useState("");
  const [data, setData] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (fl.length == 0) {
      setError("Le champ ne peut pas être vide");
    } else {
      setLoading(true);
      const file = new FormData();
      for (let i = 0; i < fl.length; i++) {
        file.append("file", fl[i]);
      }
      try {
        await authAxios.put(`/tenants/upload/${tenantid}`, file, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });
        setLoading(false);
        setSuccess("Document ajouté avec succès");
        setCount((count) => count + 1);
        getOneTenant(tenantid);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const getOneTenant = async (dt) => {
    try {
      const res = await authAxios.get(`/tenants/${dt}`);
      setData(res.data.file);
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    getTenants();
  }, [count]);

  return (
    <Fragment>
      {loading && <LoadingScreen />}
      <Typography variant="caption" color="secondary">
        Les formats acceptés sont .jpg .jpeg .png .pdf .doc .docx .gif .svg
      </Typography>
      <form onSubmit={submit}>
        <OutlinedInput
          required
          component={"span"}
          variant="outlined"
          id="assets"
          name="assets"
          type="file"
          inputProps={{ multiple: true }}
          variant="outlined"
          onChange={(e) => setFl(e.target.files)}
          fullWidth
          className={classes.form}
        />
        <TextField
          required
          component={"span"}
          variant="outlined"
          id="tenantid"
          select
          value={tenantid}
          label="Locataire"
          onChange={(e) => {
            setTenantid(e.target.value);
            getOneTenant(e.target.value);
          }}
          helperText="Selectionner un locataire*"
          fullWidth
        >
          {tenant &&
            tenant.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.name + " " + option.lastname + " - " + option.email}
              </MenuItem>
            ))}
        </TextField>
        <Button type="submit" color="primary" className={classes.button}>
          Valider
        </Button>
      </form>
      {data.length > 0 &&
        data.map((data, i) => (
          <Paper
            key={i}
            square
            style={{
              margin: "2px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "5px",
            }}
          >
            <Link to={`//localhost:5000/${data}`} target="_blank">
              {data}
            </Link>
            <DeleteFile
              data={data}
              tenantid={tenantid}
              setSuccess={setSuccess}
              setError={setError}
              getOneTenant={getOneTenant}
            />
          </Paper>
        ))}
    </Fragment>
  );
};

export default UploadFile;
