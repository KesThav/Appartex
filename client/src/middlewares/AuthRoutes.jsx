import React, { useContext } from "react";
import { UserContext } from "../middlewares/ContextAPI";
import { Route, Redirect } from "react-router-dom";

const AdminRoute = ({ component: Component, ...props }) => {
  const { user, setUser } = useContext(UserContext);

  return (
    <Route
      {...props}
      render={(props) =>
        user ? (
          user.role == "Admin" ? (
            <Redirect to="/owner" />
          ) : (
            <Redirect to="/tenant" />
          )
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default AdminRoute;
