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
import Building from "./pages/ownerpages/buildings";
import Appartment from "./pages/ownerpages/appartments";
import Bill from "./pages/ownerpages/bills";
import Contract from "./pages/ownerpages/contracts";
import UserSkeleton from "./components/userSkeleton";

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

let authAxios = Axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: token,
  },
});

const App = () => {
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState("");
  const [building, setBuilding] = useState("");
  const [appart, setAppart] = useState("");
  const [contract, setContract] = useState("");
  const [bill, setBill] = useState("");
  const [billhistory, setBillhistory] = useState("");
  const [err, setError] = useState();
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState("");

  //get data here and give it to children via Context API
  const getTenants = async () => {
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

  const getBuildings = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/buildings");
      setBuilding(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getApparts = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/appartments");
      setAppart(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getContracts = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/contracts");
      setContract(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getBills = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/bills");
      setBill(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getBillHistories = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/history/bills");
      setBillhistory(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getStatus = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/status");
      setStatus(res.data);
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
            err,
            setError,
            success,
            setSuccess,
            user,
            setUser,
            loading,
            setLoading,
            authAxios,
            tenant,
            setTenant,
            getTenants,
            building,
            setBuilding,
            getBuildings,
            appart,
            setAppart,
            getApparts,
            contract,
            setContract,
            getContracts,
            bill,
            setBill,
            getBills,
            billhistory,
            setBillhistory,
            getBillHistories,
            status,
            setStatus,
            getStatus,
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
                    <AdminRoute exact path="/buildings" component={Building} />
                    <AdminRoute
                      exact
                      path="/appartments"
                      component={Appartment}
                    />
                    <AdminRoute exact path="/bills" component={Bill} />
                    <AdminRoute exact path="/contracts" component={Contract} />
                    <AdminRoute
                      exact
                      path="/tenant/:tenantid"
                      component={UserSkeleton}
                    />
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
