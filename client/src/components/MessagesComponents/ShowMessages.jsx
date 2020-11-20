import React, { useState, useContext, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { UserContext } from "../../middlewares/ContextAPI";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import AddComments from "./AddComments";
import DeleteMessage from "./DeleteMessage";
import ArchiveMessage from "./ArchiveMessage";
import UnArchiveMessage from "./UnArchiveMessage";
import EditMessageStatus from "./EditMessageStatus";
import AddTask from "../Task/AddTask";
import Chip from "@material-ui/core/Chip";
import LoadingScreen from "../LoadingScreen";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import { ButtonGroup } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
    width: "100%",
  },
  root2: {
    width: "100%",
    displax: "flex",
    flexDirection: "column",
    boxShadow: "none",
  },
  accordion: {
    marginTop: 20,
    width: "100%",
    paddingBottom: 0,
  },
}));

const ShowMessages = ({ message, getMessages, setError, setSuccess }) => {
  const classes = useStyles();
  const { user, loading } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={classes.root}>
      {!loading ? (
        message.length > 0 &&
        message.map((data) => (
          <Accordion
            key={data._id}
            expanded={expanded === data._id}
            className={classes.accordion}
          >
            <AccordionSummary
              component={"span"}
              expandIcon={
                <ExpandMoreIcon
                  onClick={() =>
                    setExpanded(expanded == data._id ? false : data._id)
                  }
                />
              }
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              className={classes.accordion}
            >
              <Card className={classes.root}>
                <CardHeader
                  avatar={<Avatar className={classes.avatar} />}
                  title={`${
                    data.createdBy
                      ? data.createdBy.name + " " + data.createdBy.lastname
                      : "Compte supprimé"
                  }  -> ${
                    data.sendedTo
                      ? data.sendedTo.name + " " + data.sendedTo.lastname
                      : "Compte supprimé"
                  } `}
                  subheader={moment(data.createdAt).fromNow()}
                  action={<Chip label={data.status} color="primary" />}
                />
                <CardContent>
                  <Typography variant="h6" color="textPrimary" component="p">
                    {data.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {data.content}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  {data.comments.length}
                  <ChatBubbleOutlineOutlinedIcon />

                  {user &&
                    user.role == "Admin" &&
                    (data.status !== "Archivé" ? (
                      <Fragment>
                        <ButtonGroup>
                          <ArchiveMessage
                            getMessages={getMessages}
                            id={data._id}
                            setError={setError}
                            setSuccess={setSuccess}
                          />
                          <DeleteMessage
                            getMessages={getMessages}
                            id={data._id}
                            setError={setError}
                            setSuccess={setSuccess}
                          />
                          <EditMessageStatus
                            getMessages={getMessages}
                            id={data._id}
                            statustype={data.status}
                          />
                          <AddTask id={data._id} />
                        </ButtonGroup>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <UnArchiveMessage
                          getMessages={getMessages}
                          id={data._id}
                          setError={setError}
                          setSuccess={setSuccess}
                        />
                        <DeleteMessage
                          getMessages={getMessages}
                          id={data._id}
                          setError={setError}
                          setSuccess={setSuccess}
                        />
                      </Fragment>
                    ))}
                </CardActions>
                <CardActions>
                  {user && data.status !== "Archivé" && (
                    <div className={classes.root}>
                      <Divider />
                      <AddComments
                        getMessages={getMessages}
                        id={data._id}
                        setError={setError}
                        setSuccess={setSuccess}
                      />
                    </div>
                  )}
                </CardActions>
              </Card>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.root}>
                {data.comments.map((data) => (
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
                        title={`${
                          data.createdBy
                            ? data.createdBy.name +
                              " " +
                              data.createdBy.lastname
                            : "Compte supprimé"
                        }`}
                        subheader={moment(data.createdAt).fromNow()}
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
        ))
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
};
export default ShowMessages;
