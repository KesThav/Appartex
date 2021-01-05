import React, { useContext } from "react";
import { UserContext } from "../middlewares/ContextAPI";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
  const { user, setUser } = useContext(UserContext);
  if (!user) {
    return <Redirect to="/landing" />;
  } else {
    return (
      <Route
        {...props}
        render={(props) =>
          user ? <Component {...props} /> : <Redirect to="/forbidden" />
        }
      />
    );
  }
};

export default ProtectedRoute;
