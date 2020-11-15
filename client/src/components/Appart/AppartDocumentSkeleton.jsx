import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  makeStyles,
  Divider,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import HistoryIcon from "@material-ui/icons/History";
import moment from "moment";

const useStyles = makeStyles({
  box: {
    display: "flex",
    flexDirection: "row-reverse",
    marginRight: 10,
  },
});

const ShowAppartDocuments = (props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { authAxios, setCount, count } = useContext(UserContext);
  const [picture, setPicture] = useState([]);

  const getOneAppart = async () => {
    try {
      const res = await authAxios.get(
        `/appartments/${props.match.params.appartid}`
      );
      setPicture(res.data.picture);
      setCount((count) => count + 1);
    } catch (err) {
      /* setError(err); */
      console.log(err);
    }
  };

  useEffect(() => {
    getOneAppart();
  }, [count]);

  return (
    <Fragment>
      {picture.length > 0 &&
        picture.map((data) => (
          <li>
            <img src={`http://localhost:5000/${data}`} />
          </li>
        ))}
    </Fragment>
  );
};

export default ShowAppartDocuments;
