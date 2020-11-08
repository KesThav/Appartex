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
import IconButton from "@material-ui/core/IconButton";
import CardActions from "@material-ui/core/CardActions";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import Badge from "@material-ui/core/Badge";
import AddComments from "./AddComments";
import DeleteMessage from "./DeleteMessage";
import ArchiveMessage from "./ArchiveMessage";
import UnArchiveMessage from "./UnArchiveMessage";
import EditMessageStatus from "./EditMessageStatus";
import AddTask from "./AddTask";
import { CircularProgress } from "@material-ui/core";

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
}));

const ShowMessages = ({ message, getMessages }) => {
  const classes = useStyles();
  const { authAxios, user, loading } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={classes.root}>
      {!loading ? (
        message.length > 0 &&
        message.map((data) => (
          <Accordion key={data._id} expanded={expanded === data._id}>
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
                  title={
                    data.createdBy.name +
                    " " +
                    data.createdBy.lastname +
                    " -> " +
                    data.sendedTo.name +
                    " " +
                    data.sendedTo.lastname
                  }
                  subheader={moment(data.createdAt).format("YYYY-MM-DD")}
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
                  <ChatBubbleIcon />

                  {user && user.role !== "Admin" && (
                    <AddComments getMessages={getMessages} id={data._id} />
                  )}

                  {user &&
                    user.role == "Admin" &&
                    (data.status !== "Archivé" ? (
                      <Fragment>
                        <AddComments getMessages={getMessages} id={data._id} />
                        <ArchiveMessage
                          getMessages={getMessages}
                          id={data._id}
                        />
                        <DeleteMessage
                          getMessages={getMessages}
                          id={data._id}
                        />
                        <EditMessageStatus
                          getMessages={getMessages}
                          id={data._id}
                          statustype={data.status}
                        />
                        <AddTask id={data._id} />
                      </Fragment>
                    ) : (
                      <Fragment>
                        <UnArchiveMessage
                          getMessages={getMessages}
                          id={data._id}
                        />
                        <DeleteMessage
                          getMessages={getMessages}
                          id={data._id}
                        />
                      </Fragment>
                    ))}
                </CardActions>
              </Card>
            </AccordionSummary>
            <AccordionDetails>
              <div>
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
                        title={
                          data.createdBy.name + " " + data.createdBy.lastname
                        }
                        subheader={moment(data.createdAt).format("YYYY-MM-DD")}
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
        <CircularProgress />
      )}
    </div>
  );
};
export default ShowMessages;
