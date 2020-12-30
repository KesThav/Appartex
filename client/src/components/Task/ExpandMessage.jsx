import React, { useState, useContext, useEffect, Fragment } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  makeStyles,
  Card,
  CardHeader,
  Avatar,
  Chip,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  CardActions,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { UserContext } from "../../middlewares/ContextAPI";
import moment from "moment";
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    boxShadow: "none",
  },
  accordion: {
    marginTop: 20,
    width: "100%",
    paddingBottom: 0,
    boxShadow: "none",
  },
  root2: {
    width: "100%",
    displax: "flex",
    flexDirection: "column",
    boxShadow: "none",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const ExpandMessage = ({ id, setError }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { authAxios, loading } = useContext(UserContext);
  const [expanded, setExpanded] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleExpandClick = (id) => {
    expanded == id ? setExpanded("") : setExpanded(id);
  };

  const getOneMessage = async (id) => {
    try {
      const res = await authAxios.get(`/messages/${id}`);
      setMessage(res.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    if (open == true) {
      getOneMessage(id);
    }
  }, [open]);

  return (
    <div>
      <Tooltip title="Détails">
        <Button
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ExpandMoreIcon />
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(!open)}
        disableBackdropClick
        classeName={classes.root}
        fullScreen={fullScreen}
      >
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          {message && (
            <>
              <Card className={classes.root}>
                <CardHeader
                  avatar={<Avatar className={classes.avatar} />}
                  title={`${
                    message.createdBy
                      ? message.createdBy.name +
                        " " +
                        message.createdBy.lastname
                      : "Compte supprimé"
                  }  -> ${message.sendedTo.map((data) =>
                    data ? data.name + " " + data.lastname : "Compte supprimé"
                  )} `}
                  subheader={moment(message.createdAt).format("YYYY-MM-DD")}
                  action={<Chip label={message.status} color="primary" />}
                />
                <CardContent>
                  <Typography variant="h6" color="textPrimary" component="p">
                    {message.title}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="p">
                    {message.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="Afficher les messages">
                    <IconButton
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}
                      onClick={() => handleExpandClick(message._id)}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>

                <Collapse
                  in={expanded == message._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <div className={classes.root}>
                    {message.comments.map((data) => (
                      <Fragment key={data._id}>
                        <Divider />
                        <Card className={classes.root2}>
                          <CardHeader
                            avatar={
                              <Avatar
                                aria-label="recipe"
                                className={classes.avatar}
                              ></Avatar>
                            }
                            title={
                              data.createdBy.name +
                              " " +
                              data.createdBy.lastname
                            }
                            subheader={moment(data.createdAt).format(
                              "YYYY-MM-DD"
                            )}
                          />
                          <CardContent>
                            <Typography
                              variant="body2"
                              color="textPrimary"
                              component="p"
                            >
                              {data.content}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Fragment>
                    ))}
                  </div>
                </Collapse>
              </Card>
            </>
          )}
        </DialogContent>
        <Button onClick={() => setOpen(!open)}>Retour</Button>
      </Dialog>
    </div>
  );
};

export default ExpandMessage;
