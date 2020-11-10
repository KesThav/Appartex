import React, { useContext, useState } from "react";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";

import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { UserContext } from "../middlewares/ContextAPI";

import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Switch from "@material-ui/core/switch";
import BusinessIcon from "@material-ui/icons/Business";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ReceiptIcon from "@material-ui/icons/Receipt";
import GroupIcon from "@material-ui/icons/Group";
import HomeIcon from "@material-ui/icons/Home";
import FolderIcon from "@material-ui/icons/Folder";
import StorageIcon from "@material-ui/icons/Storage";
import Chip from "@material-ui/core/Chip";
import PersonIcon from "@material-ui/icons/Person";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import ForumIcon from "@material-ui/icons/Forum";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TimelineIcon from "@material-ui/icons/Timeline";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
      display: "flex",
      backgroundColor: "#eceff1",
    },
  },
  appBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    color: "#000000",
    display: "flex",
    alignItems: "flex-end",
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: /* [theme.palette.primary.main] */ "#1A1A1D",
    color: "#ffff",
    height: "100vh",
    overflowX: "hidden",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  typography: {},
  avatar: {
    height: 70,
    width: 70,
    backgroundColor: [theme.palette.primary.light],
  },
  link: {
    textDecoration: "none",
    color: [theme.palette.primary.dark],
  },
  linkmap: {
    textDecoration: "none",
    color: "#fff",
  },
}));

const Layout = (props) => {
  const { user, setUser, setTenant } = useContext(UserContext);
  const { window } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [select, setSelect] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const ownerDrawer = (
    <List>
      {[
        {
          id: 0,
          name: "Vue Général",
          icon: <DashboardIcon />,
          link: "/owner",
        },
        {
          id: 1,
          name: "Les immeubles",
          icon: <BusinessIcon />,
          link: "/buildings",
        },
        {
          id: 2,
          name: "Les Appartements",
          icon: <HomeIcon />,
          link: "/appartments",
        },
        {
          id: 3,
          name: "Les Locataires",
          icon: <GroupIcon />,
          link: "/tenants",
        },
        {
          id: 4,
          name: "Les Contrats",
          icon: <FolderIcon />,
          link: "/contracts",
        },
        {
          id: 5,
          name: "Les Factures",
          icon: <ReceiptIcon />,
          link: "/bills",
        },
        {
          id: 6,
          name: "Les Statuts",
          icon: <TrendingUpIcon />,
          link: "/status",
        },
        {
          id: 7,
          name: "Les Messages",
          icon: <ForumIcon />,
          link: "/messages",
        },
        {
          id: 8,
          name: "Les Tâches",
          icon: <FormatListBulletedIcon />,
          link: "/tasks",
        },
        {
          id: 9,
          name: "Les Réparations",
          icon: <TimelineIcon />,
          link: "/repairs",
        },
      ].map((data) => (
        <Link
          key={data.id}
          className={classes.linkmap}
          to={data.link}
          onClick={() => setSelect(data.id)}
        >
          <ListItem button key={data.id} selected={select === data.id}>
            <ListItemIcon style={{ color: "#fff" }}>{data.icon}</ListItemIcon>
            <ListItemText primary={data.name} />
          </ListItem>
        </Link>
      ))}
    </List>
  );

  const tenantDrawer = (
    <List>
      {[
        {
          id: 0,
          name: "Mes messages",
          icon: <StorageIcon />,
          link: "/messages",
        },
      ].map((data, index) => (
        <Link
          key={data.id}
          className={classes.linkmap}
          to={data.link}
          onClick={() => setSelect(data.id)}
        >
          <ListItem button key={data.id} selected={select === data.id}>
            <ListItemIcon style={{ color: "#fff" }}>{data.icon}</ListItemIcon>
            <ListItemText primary={data.name} />
          </ListItem>
        </Link>
      ))}
    </List>
  );

  const logout = () => {
    setChecked(!checked);
    setUser(null);
    localStorage.removeItem("authtoken");
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Chip
            avatar={
              <Avatar>
                {" "}
                {user &&
                  user.name.charAt(0).toUpperCase() +
                    user.lastname.charAt(0).toUpperCase()}
              </Avatar>
            }
            label={user && user.name + " " + user.lastname}
            clickable
            onClick={() => console.log("hello")}
            color="primary"
            variant="outlined"
          />
          <Button onClick={logout}>
            <Link to="/" className={classes.link}>
              Log out
            </Link>{" "}
            <Switch
              checked={checked}
              onChange={() => setChecked(!checked)}
              name="checked"
              color="primary"
            />
          </Button>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <div
              style={{
                marginTop: "10vh",
                width: drawerWidth,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Avatar className={classes.avatar}>
                <PersonIcon style={{ fontSize: 45 }} />
              </Avatar>
              <br />
            </div>
            {user && user.role == "Admin" ? ownerDrawer : tenantDrawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <div
              style={{
                marginTop: "10vh",
                width: drawerWidth,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar className={classes.avatar}>
                <PersonIcon style={{ fontSize: 45 }} />
              </Avatar>
              <br />
            </div>
            {user && user.role == "Admin" ? ownerDrawer : tenantDrawer}
          </Drawer>
        </Hidden>
        )
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
