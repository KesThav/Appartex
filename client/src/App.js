import React, { useState, useMemo, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Layout from "./Layout/Layout";
import Ownerboard from "./pages/ownerpages/ownerboard";
import "./App.css";
import { UserContext } from "./middlewares/ContextAPI";
import Tenantboard from "./pages/tenantpages/tenantboard";
import jwtDecode from "jwt-decode";
import AdminRoute from "./middlewares/AdminRoute";
import ProtectedRoute from "./middlewares/ProtectedRoute";
import Forbidden from "./pages/forbidden";
import NotFound from "./pages/notFound";
import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeSheet from "./util/theme";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Tenantlogin from "./pages/tenantlogin";
import Axios from "axios";
import Tenant from "./pages/ownerpages/tenants";

const theme = createMuiTheme(themeSheet);

let userData;
const token = localStorage.authtoken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 100 < Date.now()) {
    window.location.href = "/";
    localStorage.removeItem("authtoken");
  } else {
    userData = decodedToken;
  }
}

const authAxios = Axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: token,
  },
});

const App = () => {
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState("");

  //get data here and give it to children via Context API
  const getTenant = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/tenants");
      setTenant(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Fragment>
      <MuiThemeProvider theme={theme}>
        <UserContext.Provider
          value={{
            user,
            setUser,
            loading,
            setLoading,
            authAxios,
            tenant,
            setTenant,
            getTenant,
          }}
        >
          <Router>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/tenant/login" component={Tenantlogin} />
              <Route>
                <Layout>
                  <Switch>
                    <AdminRoute exact path="/owner" component={Ownerboard} />
                    <AdminRoute exact path="/tenants" component={Tenant} />
                    <ProtectedRoute
                      exact
                      path="/tenant"
                      component={Tenantboard}
                    />
                    <ProtectedRoute
                      exact
                      path="/forbidden"
                      component={Forbidden}
                    />
                    <ProtectedRoute component={NotFound} />
                  </Switch>
                </Layout>
              </Route>
            </Switch>
          </Router>
        </UserContext.Provider>
      </MuiThemeProvider>
    </Fragment>
  );
};

export default App;
