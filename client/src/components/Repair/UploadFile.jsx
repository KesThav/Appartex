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
import { arrayBufferToBase64 } from "../arrayBufferToBase64";

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
    repair,
    setLoading,
    authAxios,
    getRepairs,
    count,
    setCount,
    loading,
  } = useContext(UserContext);
  const [fl, setFl] = useState([]);
  const [repairid, setRepairid] = useState("");
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
        await authAxios.put(`/repairs/upload/${repairid}`, file, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });
        setLoading(false);
        setSuccess("Document ajouté avec succès");
        setCount((count) => count + 1);
        getOneRepair(repairid);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const getOneRepair = async (dt) => {
    try {
      const res = await authAxios.get(`/repairs/${dt}`);
      const doc =
        res &&
        res.data.file.map((data) => {
          return {
            data:
              `data:${data.contentType};base64,` +
              arrayBufferToBase64(data.data.data),
            name: data.name,
            _id: data._id,
          };
        });
      setData(doc);
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    getRepairs();
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
          id="repairid"
          select
          value={repairid}
          label="Réparation"
          onChange={(e) => {
            setRepairid(e.target.value);
            getOneRepair(e.target.value);
          }}
          helperText="Selectionner une réparation*"
          fullWidth
        >
          {repair &&
            repair.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option._id}
              </MenuItem>
            ))}
        </TextField>
        <Button type="submit" color="primary" className={classes.button}>
          Valider
        </Button>
      </form>
      {data.length > 0 &&
        data.map((doc, i) => (
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
            <a href={doc.data} download={doc.name}>
              {doc.name}
            </a>
            <DeleteFile
              data={doc}
              repairid={repairid}
              setSuccess={setSuccess}
              setError={setError}
              getOneRepair={getOneRepair}
            />
          </Paper>
        ))}
    </Fragment>
  );
};

export default UploadFile;
