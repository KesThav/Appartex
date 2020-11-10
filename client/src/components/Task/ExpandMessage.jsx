import React, { useState, useContext, useEffect, Fragment } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { UserContext } from "../../middlewares/ContextAPI";
import LoadingScreen from "../LoadingScreen";
import moment from "moment";

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
}));

const ExpandMessage = ({ id }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { authAxios, loading } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);

  const getOneMessage = async (id) => {
    try {
      const res = await authAxios.get(`/messages/${id}`);
      setMessage(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Tooltip title="Détails">
        <Button
          onClick={() => {
            getOneMessage(id);
            setOpen(!open);
          }}
        >
          <ExpandMoreIcon />
          {id}
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(!open)}
        disableBackdropClick
        classeName={classes.root}
      >
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          {message && (
            <Accordion
              key={message._id}
              expanded={expanded === message._id}
              className={classes.accordion}
            >
              <AccordionSummary
                onClick={() =>
                  setExpanded(expanded == message._id ? false : message._id)
                }
                component={"span"}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                className={classes.accordion}
              >
                <Card className={classes.root}>
                  <CardHeader
                    avatar={<Avatar className={classes.avatar} />}
                    title={`${
                      message.createdBy
                        ? message.createdBy.name +
                          " " +
                          message.createdBy.lastname
                        : "Compte supprimé"
                    }  -> ${
                      message.sendedTo
                        ? message.sendedTo.name +
                          " " +
                          message.sendedTo.lastname
                        : "Compte supprimé"
                    } `}
                    subheader={moment(message.createdAt).format("YYYY-MM-DD")}
                    action={<Chip label={message.status} color="primary" />}
                  />
                  <CardContent>
                    <Typography variant="h6" color="textPrimary" component="p">
                      {message.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {message.content}
                    </Typography>
                  </CardContent>
                </Card>
              </AccordionSummary>
              <AccordionDetails>
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
                            data.createdBy.name + " " + data.createdBy.lastname
                          }
                          subheader={moment(data.createdAt).format(
                            "YYYY-MM-DD"
                          )}
                        />
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {data.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fragment>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          )}
        </DialogContent>
        <Button onClick={() => setOpen(!open)}>Retour</Button>
      </Dialog>
    </div>
  );
};

export default ExpandMessage;
