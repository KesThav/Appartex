import Axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Navbar } from "../Layout/navbar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  CardHeader,
  Avatar,
  Paper,
} from "@material-ui/core";
import moment from "moment";
import PersonIcon from "@material-ui/icons/Person";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

const tutorialSteps = [
  {
    imgPath:
      "https://images.unsplash.com/photo-1601807112459-a894d5bd286b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80",
  },
  {
    imgPath:
      "https://images.unsplash.com/photo-1527772482340-7895c3f2b3f7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1420&q=80",
  },
  {
    imgPath:
      "https://images.unsplash.com/photo-1491955478222-69ae25414368?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 400,
    maxWidth: "100%",
    overflow: "hidden",
    display: "block",
    width: "100%",
  },
  card: {
    marginBottom: 10,
  },
  card2: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
  },
  Typography: {
    marginBottom: 10,
  },
  avatar: {
    height: 80,
    width: 80,
    marginBottom: 20,
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
}));

const Appartpage = (props) => {
  const [data, setData] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const fetchAppart = async () => {
      const res = await Axios.get(
        `https://appartex-server.herokuapp.com/appartments/show/${props.match.params.appartid}`
      );
      console.log(res.data);
      setData(res.data);
    };
    fetchAppart();
  }, []);

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  return (
    <Fragment>
      <Navbar />
      <Container>
        <Button
          startIcon={<KeyboardBackspaceIcon />}
          className={classes.button}
        >
          <Link to="/" className={classes.link}>
            Retour
          </Link>
        </Button>

        <Grid container spacing={2}>
          <Grid item lg={8} xl={8} md={8} sm={12} xs={12}>
            <Paper>
              <div className={classes.root}>
                <img
                  className={classes.img}
                  src={tutorialSteps[activeStep].imgPath}
                  alt={tutorialSteps[activeStep].label}
                />
                <MobileStepper
                  steps={maxSteps}
                  position="static"
                  variant="text"
                  activeStep={activeStep}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === maxSteps - 1}
                    >
                      Next
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowLeft />
                      ) : (
                        <KeyboardArrowRight />
                      )}
                    </Button>
                  }
                  backButton={
                    <Button
                      size="small"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowRight />
                      ) : (
                        <KeyboardArrowLeft />
                      )}
                      Back
                    </Button>
                  }
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            {data && (
              <Fragment>
                <Card className={classes.card}>
                  <CardHeader
                    avatar={
                      <Avatar
                        aria-label="recipe"
                        style={{
                          background:
                            "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                        }}
                      />
                    }
                    title={`Publié le ${moment(data.createdAt).format(
                      "DD/MM/YYYY"
                    )}`}
                    subheader={`Dernière modification effectuée le ${moment(
                      data.updatedAt
                    ).format("DD/MM/YYYY")}`}
                  />
                  <CardActionArea>
                    <CardMedia className={classes.media} image="" title="" />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Détails de l'appartement
                      </Typography>
                      <Typography>
                        {` Adresse : ${
                          data.building ? data.building.adress : data.adress
                        } ${
                          data.building
                            ? data.building.postalcode
                            : data.postalcode
                        } ${data.building ? data.building.city : data.city}`}
                      </Typography>
                      <Typography>{`Taille : ${data.size} pièces`}</Typography>
                      <Typography>{`Prix : à discuter`}</Typography>
                      <Typography>{`Disponible de suite !`}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

                <Card>
                  <CardActionArea>
                    <CardMedia className={classes.media} image="" title="" />
                    <CardContent className={classes.card2}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        className={classes.Typography}
                      >
                        A propos
                      </Typography>
                      <Avatar className={classes.avatar}>
                        <PersonIcon style={{ fontSize: 60 }} />
                      </Avatar>
                      <Typography className={classes.Typography}>
                        {`${data.createdBy.name} ${data.createdBy.lastname}`}
                      </Typography>
                      <Typography>
                        <Typography
                          className={classes.Typography}
                        >{`${data.createdBy.email} `}</Typography>
                      </Typography>
                      <Button
                        color="secondary"
                        variant="contained"
                        className={classes.button}
                      >
                        Envoyer un message
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Fragment>
            )}
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Appartpage;
