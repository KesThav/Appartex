import React, { useContext, Fragment } from "react";
import { UserContext } from "../../middlewares/ContextAPI";
import { Paper, Typography } from "@material-ui/core";

function UserDashboard(props) {
  const { loading, setLoading } = useContext(UserContext);

  const { user, setUser } = useContext(UserContext);
  console.log(user);
  return (
    <Fragment>
      <Paper square>
        <Typography variant="h4">User details</Typography>
      </Paper>
    </Fragment>
  );
}

export default UserDashboard;
