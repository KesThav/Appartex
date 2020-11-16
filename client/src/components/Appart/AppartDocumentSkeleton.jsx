import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  makeStyles,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import Carousel from "react-material-ui-carousel";
import HistoryIcon from "@material-ui/icons/History";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const ShowAppartDocuments = ({ appart }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios, setCount, count } = useContext(UserContext);
  const [picture, setPicture] = useState([]);

  const getOneAppart = async (appart) => {
    try {
      const res = await authAxios.get(`/appartments/${appart}`);
      setPicture(res.data.picture);
      setCount((count) => count + 1);
    } catch (err) {
      /* setError(err); */
      console.log(err);
    }
  };

  useEffect(() => {
    getOneAppart(appart);
  }, []);

  return (
    <Fragment>
      <Tooltip title="Détails">
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
        >
          <HistoryIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(!open)}>
        <DialogContent>
          <Carousel>
            {picture.length > 0 &&
              picture.map((data, i) => (
                <img key={i} src={`http://localhost:5000/${data}`} />
              ))}
          </Carousel>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ShowAppartDocuments;
