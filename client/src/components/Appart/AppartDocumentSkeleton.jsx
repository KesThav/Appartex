import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  Button,
} from "@material-ui/core";
import { UserContext } from "../../middlewares/ContextAPI";
import Carousel from "react-material-ui-carousel";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { arrayBufferToBase64 } from "../arrayBufferToBase64";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const ShowAppartDocuments = ({ appart, setError }) => {
  const [open, setOpen] = useState(false);
  const { authAxios, setCount } = useContext(UserContext);
  const [picture, setPicture] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getOneAppart = async (appart) => {
    try {
      const res = await authAxios.get(`/appartments/${appart}`);
      const img =
        res &&
        res.data.picture.map(
          (data) =>
            `data:${data.contentType};base64,` +
            arrayBufferToBase64(data.data.data)
        );
      setPicture(img);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    if (open == true) {
      getOneAppart(appart);
    }
  }, [open]);

  return (
    <Fragment>
      <Tooltip title="Détails">
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
        >
          <PhotoCameraIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(!open)}
        fullScreen={fullScreen}
      >
        <DialogContent>
          <Carousel>
            {picture.length > 0 &&
              picture.map((data, i) => (
                <img key={i} style={{ maxWidth: "100%" }} src={`${data}`} />
              ))}
          </Carousel>
        </DialogContent>
        {fullScreen && <Button onClick={() => setOpen(!open)}>Retour</Button>}
      </Dialog>
    </Fragment>
  );
};

export default ShowAppartDocuments;
