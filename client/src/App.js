import React, { useState, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./pages/newlanding";
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
import Axios from "axios";
import Tenant from "./pages/ownerpages/tenants";
import Building from "./pages/ownerpages/buildings";
import Appartment from "./pages/ownerpages/appartments";
import Bill from "./pages/ownerpages/bills";
import Contract from "./pages/ownerpages/contracts";
import UserSkeleton from "./components/userSkeleton";
import Status from "./pages/ownerpages/statut";
import Message from "./pages/ownerpages/messages";
import Tasks from "./pages/ownerpages/tasks";
import Repair from "./pages/ownerpages/repairs";
import AuthRoute from "./middlewares/AuthRoutes";
import Document from "./pages/ownerpages/documents";

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
  baseURL:
    /* "https://appartex-server.herokuapp.com" */ "http://localhost:5000",
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
  const [task, setTask] = useState("");
  const [repair, setRepair] = useState("");
  const [count, setCount] = useState(0);

  //get data here and give it to children via Context API
  const getTenants = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get("/tenants");
      setTenant(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getBuildings = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get("/buildings");
      setBuilding(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getApparts = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get("/appartments");
      const data =
        res &&
        res.data.map((data) => {
          return {
            picture: data.picture.map((pic) => pic),
            hasBuilding: data.building ? true : false,
            _id: data._id,
            adress: data.building ? data.building.adress : data.adress,
            postalcode: data.building
              ? data.building.postalcode
              : data.postalcode,
            city: data.building ? data.building.city : data.city,
            status: data.status,
            size: data.size,
            building: data.building ? data.building._id : null,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
      setAppart(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getContracts = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get("/contracts");
      const data =
        res &&
        res.data.map((data) => {
          return {
            _id: data._id,
            tenantid: data.tenant._id,
            tenant: `${data.tenant.name} ${data.tenant.lastname}`,
            appartid: data.appartmentid._id,
            adress: data.appartmentid.building
              ? data.appartmentid.building.adress
              : data.appartmentid.adress,
            city: data.appartmentid.building
              ? data.appartmentid.building.city
              : data.appartmentid.city,
            postalcode: data.appartmentid.building
              ? data.appartmentid.building.postalcode
              : data.appartmentid.postalcode,
            size: data.appartmentid.size,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            charge: data.charge,
            rent: data.rent,
            file: data.file.map((file) => file),
            other: data.other,
            status: data.status,
          };
        });
      setContract(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getBills = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get("/bills");
      setBill(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getBillHistories = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get("/history/bills");
      setBillhistory(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getStatus = async () => {
    try {
      const res = await authAxios.get("/status");
      setStatus(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTasks = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get("/tasks");
      setTask(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getRepairs = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get("/repairs");
      setRepair(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
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
            task,
            setTask,
            getTasks,
            count,
            setCount,
            repair,
            setRepair,
            getRepairs,
          }}
        >
          <Router>
            <Switch>
              <AuthRoute exact path="/" component={Landing} />
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
                    <AdminRoute exact path="/status" component={Status} />
                    <AdminRoute
                      exact
                      path="/tenants/:tenantid"
                      component={UserSkeleton}
                    />
                    <AdminRoute exact path="/tasks" component={Tasks} />
                    <AdminRoute exact path="/repairs" component={Repair} />
                    <AdminRoute exact path="/documents" component={Document} />
                    <ProtectedRoute
                      exact
                      path="/messages"
                      component={Message}
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
