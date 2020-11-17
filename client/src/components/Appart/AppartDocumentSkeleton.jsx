import React, { useState, useContext, Fragment, useEffect } from "react";
import { Tooltip, IconButton, Dialog, DialogContent } from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import Carousel from "react-material-ui-carousel";
import FolderIcon from "@material-ui/icons/Folder";

const ShowAppartDocuments = ({ appart, setError }) => {
  const [open, setOpen] = useState(false);
  const { authAxios, setCount } = useContext(UserContext);
  const [picture, setPicture] = useState([]);

  const getOneAppart = async (appart) => {
    try {
      const res = await authAxios.get(`/appartments/${appart}`);
      setPicture(res.data.picture);
      setCount((count) => count + 1);
    } catch (err) {
      setError(err.response.data);
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
          <FolderIcon />
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
