import React, { useState, useContext, useEffect, Fragment } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import {
  Paper,
  makeStyles,
  Typography,
  Button,
  TextField,
  MenuItem,
  OutlinedInput,
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
    contract,
    setLoading,
    authAxios,
    getContracts,
    count,
    setCount,
    loading,
  } = useContext(UserContext);
  const [fl, setFl] = useState([]);
  const [contractid, setContractid] = useState("");
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
        await authAxios.put(`/contracts/upload/${contractid}`, file, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });
        setLoading(false);
        setSuccess("Document ajouté avec succès");
        setCount((count) => count + 1);
        getOneContract(contractid);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const getOneContract = async (dt) => {
    try {
      const res = await authAxios.get(`/contracts/${dt}`);
      setData(res.data.file);
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    getContracts();
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
          id="contractid"
          select
          value={contractid}
          label="Contrat"
          onChange={(e) => {
            setContractid(e.target.value);
            getOneContract(e.target.value);
          }}
          helperText="Selectionner un contrat*"
          fullWidth
        >
          {contract &&
            contract.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.tenant + " - "}
                {option.adress +
                  " " +
                  option.postalcode +
                  " " +
                  option.city +
                  ", " +
                  option.size +
                  " pièces"}
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
            <Link
              to={`//appartex-server.herokuapp.com/${data}`}
              target="_blank"
            >
              {data}
            </Link>
            <DeleteFile
              data={data}
              contractid={contractid}
              setSuccess={setSuccess}
              setError={setError}
              getOneContract={getOneContract}
            />
          </Paper>
        ))}
    </Fragment>
  );
};

export default UploadFile;
