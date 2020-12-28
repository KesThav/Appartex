import React, { useState, useContext, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import { Collapse, IconButton, Box } from "@material-ui/core";
import clsx from "clsx";
import { MessageSkeleton } from "../Skeleton/MessageSkeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
    width: "100%",
    marginBottom: 20,
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
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const ShowMessages = ({ message, getMessages, setError, setSuccess }) => {
  const classes = useStyles();
  const { user, loading } = useContext(UserContext);
  const [expanded, setExpanded] = useState("");

  const handleExpandClick = (id) => {
    expanded == id ? setExpanded("") : setExpanded(id);
  };

  return (
    <div className={classes.root}>
      {!loading ? (
        message.length > 0 &&
        message.map((data) => (
          <Card className={classes.root} variant="outlined">
            <CardHeader
              avatar={<Avatar className={classes.avatar} />}
              title={`${
                data.createdBy
                  ? data.createdBy.name + " " + data.createdBy.lastname
                  : "Compte supprimé"
              }  -> ${data.sendedTo.map((data) =>
                data ? data.name + " " + data.lastname : "Compte supprimé"
              )} `}
              subheader={moment(data.createdAt).fromNow()}
              action={<Chip label={data.status} color="primary" />}
            />
            <CardContent>
              <Typography variant="h6" color="textPrimary" component="p">
                {data.title}
              </Typography>
              <Typography variant="body2" color="textPrimary" component="p">
                {data.content}
              </Typography>
            </CardContent>
            <CardActions
              disableSpacing
              style={{ display: "flex", alignContent: "space-between" }}
            >
              <Box style={{ width: "100%" }}>
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
                        <AddTask id={data._id} setSuccess={setSuccess} />
                      </ButtonGroup>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <ButtonGroup>
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
                      </ButtonGroup>
                    </Fragment>
                  ))}
              </Box>
              {data.comments.length}
              <ChatBubbleOutlineOutlinedIcon />
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded == data._id,
                })}
                onClick={() => handleExpandClick(data._id)}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <CardActions>
              {user && data.status !== "Archivé" && (
                <div className={classes.root}>
                  <Divider variant="middle" style={{ marginBottom: "10px" }} />
                  <AddComments
                    getMessages={getMessages}
                    id={data._id}
                    setError={setError}
                    setSuccess={setSuccess}
                  />
                </div>
              )}
            </CardActions>
            <Collapse in={expanded == data._id} timeout="auto" unmountOnExit>
              <div className={classes.root}>
                {data.comments.map((data) => (
                  <Fragment key={data._id}>
                    <Divider variant="middle" />
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
        ))
      ) : (
        <Fragment>
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </Fragment>
      )}
    </div>
  );
};
export default ShowMessages;
