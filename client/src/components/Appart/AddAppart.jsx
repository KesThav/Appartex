import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import {
  makeStyles,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Typography,
  Tabs,
  Tab,
  AppBar,
} from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
};

const useStyles = makeStyles((theme) => ({
  appbar: {
    background: "#fff",
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
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

const AddAppart = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    building,
    setLoading,
    authAxios,
    getBuildings,
    count,
    setCount,
    loading,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adress, setAdress] = useState(null);
  const [postalcode, setPostalcode] = useState(null);
  const [city, setCity] = useState(null);
  const [size, setSize] = useState("");
  const [build, setBuild] = useState(null);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setError("");
    setSuccess("");
    setPostalcode("");
    setCity("");
    setAdress("");
    setBuild("");
    setSize("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if ((!adress || !postalcode || !city) && !build) {
      setError(
        "L'adresse et l'immeuble ne peuvent pas être vide en même temps"
      );
    } else if ((adress || postalcode || city) && build) {
      setError(
        "L'adresse et l'immeuble ne peuvent pas être rempli en même temps"
      );
    } else if (!size) {
      setError("La taille ne peut pas être vide");
    } else {
      setLoading(true);
      const data = {
        adress,
        postalcode,
        city,
        size,
        building: build,
      };
      try {
        await authAxios.post("/appartments/add", data);
        setLoading(false);
        setSuccess("Appartement créé avec succès");
        setCount((count) => count + 1);
      } catch (err) {
        setLoading(false);
        setError(err.response.data);
      }
    }
  };

  const OnOpen = () => {
    setOpen(!open);
    setError("");
    setSuccess("");
    setPostalcode("");
    setCity("");
    setAdress("");
    setBuild("");
    setSize("");
  };

  useEffect(() => {
    if (open == true) {
      getBuildings();
    }
  }, [count, open]);

  return (
    <div>
      <Box className={classes.box}>
        <Button color="primary" variant="contained" onClick={() => OnOpen()}>
          Ajouter
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Créer un appartment"}</DialogTitle>

        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </div>
          <div className={classes.root}>
            <AppBar
              position="static"
              className={classes.appbar}
              component={"span"}
            >
              <Tabs
                component={"span"}
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Appartement solitaire" {...a11yProps(0)} />
                <Tab label="Appartement dans un immeuble" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <form onSubmit={submit} autoComplete="off">
                <TextField
                  required
                  id="adress"
                  type="text"
                  variant="outlined"
                  onChange={(e) => setAdress(e.target.value)}
                  fullWidth
                  placeholder="Adresse*"
                  className={classes.form}
                />
                <TextField
                  required
                  id="codepostal"
                  variant="outlined"
                  type="number"
                  onChange={(e) => setPostalcode(e.target.value)}
                  fullWidth
                  placeholder="Code postal*"
                  className={classes.form}
                />
                <TextField
                  required
                  id="city"
                  type="text"
                  variant="outlined"
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                  placeholder="Ville*"
                  className={classes.form}
                />
                <TextField
                  required
                  id="size"
                  type="number"
                  variant="outlined"
                  onChange={(e) => setSize(e.target.value)}
                  fullWidth
                  placeholder="taille*"
                  className={classes.form}
                />
                <Box className={classes.box2}>
                  <Button
                    disabled={loading}
                    className={classes.button}
                    color="inherit"
                    onClick={() => setOpen(!open)}
                  >
                    Retour
                  </Button>

                  <Button
                    disabled={loading}
                    type="submit"
                    color="primary"
                    className={classes.button}
                  >
                    Valider
                  </Button>
                </Box>
              </form>
            </TabPanel>
            <TabPanel value={value} index={1}>
              {building && building.length == 0 && (
                <Alert severity="info">
                  Aucun immeuble trouvé. Merci de créer un ou des immeubles
                  avant de créer un appartement
                </Alert>
              )}
              <br />
              <form onSubmit={submit}>
                <TextField
                  required
                  id="size"
                  type="number"
                  variant="outlined"
                  onChange={(e) => setSize(e.target.value)}
                  fullWidth
                  placeholder="taille*"
                  className={classes.form}
                />
                <TextField
                  required
                  variant="outlined"
                  id="building"
                  select
                  value={build}
                  label="Immeuble"
                  onChange={(e) => setBuild(e.target.value)}
                  helperText="Selectionner un immeuble"
                  fullWidth
                >
                  {building &&
                    building.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.adress} {option.postalcode} {option.city}
                      </MenuItem>
                    ))}
                </TextField>
                <Box className={classes.box2}>
                  <Button
                    disabled={loading}
                    className={classes.button}
                    color="inherit"
                    onClick={() => setOpen(!open)}
                  >
                    Retour
                  </Button>

                  <Button
                    disabled={loading}
                    type="submit"
                    color="primary"
                    className={classes.button}
                  >
                    Valider
                  </Button>
                </Box>
              </form>
            </TabPanel>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddAppart;
