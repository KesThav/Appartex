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
import DeleteImage from "./DeleteImage";

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

const UploadImage = ({ setSuccess, setError }) => {
  const classes = useStyles();
  const {
    appart,
    setLoading,
    authAxios,
    getApparts,
    count,
    setCount,
    loading,
  } = useContext(UserContext);
  const [pic, setPic] = useState([]);
  const [appartid, setAppartid] = useState("");
  const [data, setData] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (pic.length == 0) {
      setError("Le champ ne peut pas être vide");
    } else {
      setLoading(true);
      const picture = new FormData();
      for (let i = 0; i < pic.length; i++) {
        picture.append("picture", pic[i]);
      }
      try {
        await authAxios.put(`/appartments/upload/${appartid}`, picture, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });
        setLoading(false);
        setSuccess("Image ajouté avec succès");
        setCount((count) => count + 1);
        getOneAppart(appartid);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const getOneAppart = async (dt) => {
    try {
      const res = await authAxios.get(`/appartments/${dt}`);
      setData(res.data.picture);
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    getApparts();
  }, [count]);

  return (
    <Fragment>
      {loading && <LoadingScreen />}
      <Typography variant="caption" color="secondary">
        Les formats acceptés sont .jpg .jpeg .png .gif .svg
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
          onChange={(e) => setPic(e.target.files)}
          fullWidth
          className={classes.form}
        />
        <TextField
          required
          component={"span"}
          variant="outlined"
          id="appartid"
          select
          value={appartid}
          label="Appartement"
          onChange={(e) => {
            setAppartid(e.target.value);
            getOneAppart(e.target.value);
          }}
          helperText="Selectionner un appartement*"
          fullWidth
        >
          {appart &&
            appart.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {!option.building
                  ? option.adress +
                    " " +
                    option.postalcode +
                    " " +
                    option.city +
                    ", " +
                    option.size +
                    " pièces"
                  : option.building.adress +
                    " " +
                    option.building.postalcode +
                    " " +
                    option.building.city +
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
        data.map((data) => (
          <Paper
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
            <DeleteImage
              data={data}
              appartid={appartid}
              setSuccess={setSuccess}
              setError={setError}
              getOneAppart={getOneAppart}
            />
          </Paper>
        ))}
    </Fragment>
  );
};

export default UploadImage;
