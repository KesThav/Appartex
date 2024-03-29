import React, { useContext, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Hidden,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  makeStyles,
  Avatar,
  Button,
  Switch,
  Chip,
  useMediaQuery,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { UserContext } from "../middlewares/ContextAPI";
import { FormControlLabel } from "@material-ui/core";
import { Link } from "react-router-dom";
import BusinessIcon from "@material-ui/icons/Business";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ReceiptIcon from "@material-ui/icons/Receipt";
import GroupIcon from "@material-ui/icons/Group";
import HomeIcon from "@material-ui/icons/Home";
import FolderIcon from "@material-ui/icons/Folder";
import StorageIcon from "@material-ui/icons/Storage";
import PersonIcon from "@material-ui/icons/Person";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import ForumIcon from "@material-ui/icons/Forum";
import InfoIcon from "@material-ui/icons/Info";
import TimelineIcon from "@material-ui/icons/Timeline";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useTheme } from "@material-ui/core/styles";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
      flexShrink: 0,
      backgroundColor: "#eceff1",
    },
  },
  appBar: {
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    backgroundColor: "transparent",
    boxShadow: "none",
    color: "#000000",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      alignItems: "unset !important",
      justifyContent: "unset !important",
      backgroundColor: theme.palette.background.default,
      boxShadow: "unset !important",
    },
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#1A1A1D",
    color: "#ffff",
    height: "100%",
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
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
  linkmap: {
    textDecoration: "none",
    color: "#fff",
  },
  divider: {
    color: "#fff",
  },
  toolbarstyle: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-between",
    },
  },
}));

const Layout = (props) => {
  const { user, setUser, setTenant } = useContext(UserContext);
  const { window } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [select, setSelect] = useState(null);
  const theme = useTheme();
  const breakValue = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const ownerDrawer = (
    <List>
      {[
        {
          id: 0,
          name: "Accueil",
          icon: <DashboardIcon />,
          link: "/owner",
        },
        {
          id: 1,
          name: "Les Immeubles",
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
          name: "Les Messages",
          icon: <ForumIcon />,
          link: "/messages",
        },
        {
          id: 7,
          name: "Les Tâches",
          icon: <FormatListBulletedIcon />,
          link: "/tasks",
        },
        {
          id: 8,
          name: "Les Réparations",
          icon: <TimelineIcon />,
          link: "/repairs",
        },
        {
          id: 9,
          name: "Les Statuts",
          icon: <InfoIcon />,
          link: "/status",
        },
        {
          id: 10,
          name: "Gérer les documents",
          icon: <AssignmentIcon />,
          link: "/documents",
        },
      ].map((data) => (
        <Link
          key={data.id}
          className={classes.linkmap}
          to={data.link}
          onClick={() => setSelect(data.id)}
        >
          <ListItem
            button
            key={data.id}
            selected={select === data.id}
            onClick={() => breakValue && handleDrawerToggle}
          >
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
          name: "Accueil",
          icon: <DashboardIcon />,
          link: "/tenant",
        },
        {
          id: 1,
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
      <AppBar position="fixed" className={classes.appBar} >
        <Toolbar className={classes.toolbarstyle}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <Chip
              avatar={
                <Avatar>
                  {user &&
                    user.name.charAt(0).toUpperCase() +
                      user.lastname.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={user && user.name + " " + user.lastname}
              clickable
              onClick={() => console.log("hello")}
              variant="outlined"
            />
            <Button onClick={logout}>
              <Link to="/" className={classes.link}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                      name="checked"
                      color="default"
                    />
                  }
                  label={!breakValue && "déconnexion"}
                />
              </Link>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden mdDown implementation="css">
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
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
