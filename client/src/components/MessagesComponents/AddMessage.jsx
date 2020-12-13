import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Checkbox,
  Box,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const useStyles = makeStyles({
  button: {
    marginBottom: 30,
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
});

const AddMessage = ({ setSuccess }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const {
    authAxios,
    getTenants,
    tenant,
    user,
    setLoading,
    setCount,
    count,
  } = useContext(UserContext);
  const [err, setError] = useState("");
  const [tenantid, setTenantid] = useState([]);
  const [content, setContent] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (user.role == "Admin") {
      if (tenantid.length == 0 || !content || !title) {
        setError("Complétez tous les champs");
      } else {
        setLoading(true);
        const data = {
          sendedTo: tenantid,
          sendedToType: "Tenant",
          content,
          title,
          createdByType: "Owner",
        };
        try {
          const res = await authAxios.post("/messages/add", data);
          setLoading(false);
          setOpen(false);
          setSuccess("Message envoyé");
          setCount((count) => count + 1);
        } catch (err) {
          setLoading(false);
          setError(err.response.data);
        }
      }
    } else {
      if (!content || !title) {
        setError("Complétez tous les champs");
      } else {
        setLoading(true);
        const data = {
          sendedTo: [user.createdBy],
          sendedToType: "Owner",
          content,
          title,
          createdByType: "Tenant",
        };
        try {
          const res = await authAxios.post("/messages/add", data);
          setLoading(false);
          setOpen(false);
          setSuccess("Message envoyé");
          setCount((count) => count + 1);
        } catch (err) {
          setLoading(false);
          setError(err.response.data);
        }
      }
    }
  };

  useEffect(() => {
    if (open == true) {
      getTenants();
    }
  }, [count, open]);

  const handleChange = (event, filter) => {
    let newData = filter.map((data) => data._id);
    setTenantid(newData);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <div>
      <Button
        className={classes.button}
        variant="outlined"
        onClick={() => setOpen(!open)}
      >
        Envoyer un message
      </Button>
      <Dialog open={open} onClose={() => setOpen(!open)} disableBackdropClick>
        <DialogTitle>{"Envoyer un message"}</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            {err && <Alert severity="error">{err}</Alert>}
          </div>
          <form onSubmit={submit}>
            {user && user.role == "Admin"
              ? tenant && (
                  <Autocomplete
                    multiple
                    options={tenant}
                    disableCloseOnSelect
                    getOptionLabel={(option) =>
                      option.name + " " + option.lastname
                    }
                    onChange={handleChange}
                    renderOption={(option, { selected }) => (
                      <React.Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name + " " + option.lastname}
                      </React.Fragment>
                    )}
                    style={{ width: "100%", marginBottom: 17 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Sélectionner un ou des locataires"
                      />
                    )}
                  />
                )
              : null}
            <TextField
              required
              id="reference"
              type="text"
              variant="outlined"
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              placeholder="Titre*"
              className={classes.form}
            />
            <TextField
              required
              id="amount"
              variant="outlined"
              type="text"
              multiline
              rows={2}
              rowsMax={4}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              placeholder="Message*"
              className={classes.form}
            />
            <Box className={classes.box2}>
              <Button
                className={classes.button}
                color="inherit"
                onClick={() => setOpen(!open)}
              >
                Retour
              </Button>

              <Button type="submit" color="primary" className={classes.button}>
                Valider
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddMessage;
