import React, { useContext, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { UserContext } from "../../middlewares/ContextAPI";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Chip from "@material-ui/core/Chip";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import { IconButton, Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

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

export const MessageSkeleton = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Card className={classes.root} variant="outlined">
        <CardHeader
          avatar={
            <Skeleton animation="wave" variant="circle">
              <Avatar />
            </Skeleton>
          }
          title={<Skeleton animation="wave" variant="text" width={"40%"} />}
          subheader={<Skeleton animation="wave" variant="text" width={"30%"} />}
          action={
            <Skeleton animation="wave">
              <Chip />
            </Skeleton>
          }
        />
        <CardContent>
          <Typography variant="h6" color="textPrimary" component="p">
            {<Skeleton animation="wave" variant="text" width={"40%"} />}
          </Typography>
          <Typography variant="body2" color="textPrimary" component="p">
            {<Skeleton animation="wave" variant="text" width={"55%"} />}
          </Typography>
        </CardContent>
        <CardActions
          disableSpacing
          style={{ display: "flex", alignContent: "space-between" }}
        >
          <Box style={{ width: "100%", display: "flex" }}>
            <Fragment>
              <Skeleton
                animation="wave"
                variant="circle"
                style={{ marginRight: 10 }}
              >
                <Avatar />
              </Skeleton>
              <Skeleton
                animation="wave"
                variant="circle"
                style={{ marginRight: 10 }}
              >
                <Avatar />
              </Skeleton>
              <Skeleton animation="wave" variant="circle">
                <Avatar />
              </Skeleton>
            </Fragment>
          </Box>
          <ChatBubbleOutlineOutlinedIcon />
          <IconButton>
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
};
