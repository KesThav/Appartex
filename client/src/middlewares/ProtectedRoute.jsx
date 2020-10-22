import React, { useContext } from "react";
import { UserContext } from "../middlewares/ContextAPI";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
  const { user, setUser } = useContext(UserContext);
  if (!user) {
    return <Redirect to="/" />;
  } else {
    return (
      <Route
        {...props}
        render={(props) =>
          user /* &&
          (user.role == "Admin" || user._id == props.match.params.tenantid) */ ? (
            <Component {...props} />
          ) : (
            <Redirect to="/forbidden" />
          )
        }
      />
    );
  }
};

export default ProtectedRoute;
