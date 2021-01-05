import React, { useContext } from "react";
import { UserContext } from "../middlewares/ContextAPI";
import { Route, Redirect } from "react-router-dom";

const AdminRoute = ({ component: Component, ...props }) => {
  const { user, setUser } = useContext(UserContext);

  if (!user) {
    return <Redirect to="/landing" />;
  } else {
    return (
      <Route
        {...props}
        render={(props) =>
          user && user.role == "Admin" ? (
            <Component {...props} />
          ) : (
            <Redirect to="/forbidden" />
          )
        }
      />
    );
  }
};

export default AdminRoute;
