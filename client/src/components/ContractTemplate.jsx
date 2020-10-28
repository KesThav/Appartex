import React, { useContext } from "react";
import { makeStyles, Paper, Box, Typography, Grid } from "@material-ui/core";
import { UserContext } from "../middlewares/ContextAPI";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
  },
  header: {
    width: "100%",
    minHeight: 150,
    background: [theme.palette.primary.dark],
    color: "#fff",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  typography: {
    textAlign: "center",
  },
}));

const ContractTemplate = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  return (
    <div>
      <Paper className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h2" className={classes.typography}>
            BAIL A LOYER POUR HABITATION
          </Typography>
        </Box>
        <Grid>
          <Grid item sm={5}>
            <Typography>Bailleur :</Typography>
            <Typography>
              {user.name} {user.lastname}
            </Typography>
            <Typography>Route fictive 52 1700 Fribourg</Typography>
          </Grid>
          <Grid item sm={5} style={{ background: "red" }}>
            <Typography>Locataire : locataire</Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default ContractTemplate;
