import React, { Fragment, useEffect, useState, useContext } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  makeStyles,
  CardActionArea,
  CardHeader,
  Container,
  Checkbox,
  TextField,
  Box,
} from "@material-ui/core";
import { UserContext } from "../middlewares/ContextAPI";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress";
import moment from "moment";
import { Navbar } from "../Layout/navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    /* padding: 10 */
  },
  media: {
    height: 237,
  },
  details: {
    backgroundColor: "#2196f3",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1769aa",
    },
  },
  filter1: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: 10,
    },
    width: "45%",
    display: "flex",
    /* alignContent: "center", */
  },
  box: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  pagination: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
    marginBottom: 30,
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  collapsecard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
  },
  Typography: {
    marginBottom: 10,
  },
}));

const Main = (props) => {
  const classes = useStyles();
  const [activeFilter, setActiveFilter] = useState([]);
  const [activeFilterSize, setActiveFilterSize] = useState([]);
  const [page, setPage] = React.useState(1);
  const [lowbound, setLowbound] = useState(0);
  const [upbound, setUpbound] = useState(8);
  const { fetchData, data, loading } = useContext(UserContext);

  const handlePageChange = (event, value) => {
    setPage(value);
    setLowbound(value * 8 - 8);
    setUpbound(value * 8);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const dynamicSearch = () => {
    if (data) {
      return data
        .filter((data) => {
          if (activeFilter.length == 0) {
            return data;
          } else {
            return activeFilter.includes(data.city);
          }
        })
        .filter((data) => {
          if (activeFilterSize.length == 0) {
            return data;
          } else {
            return activeFilterSize.includes(data.size);
          }
        });
    }
  };

  const handleChange = (event, filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleChangeSize = (event, filter) => {
    setActiveFilterSize(filter);
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pageNumber = () => {
    return data &&
      dynamicSearch().length % 8 !== 0 &&
      dynamicSearch().length / 8 > Math.round(dynamicSearch().length / 8)
      ? Math.round(dynamicSearch().length / 8 + 1)
      : Math.round(dynamicSearch().length / 8);
  };

  const removeDuplicatesCity = () => {
    let dt = data && data.map((data) => data.city);
    return [...new Set(dt)];
  };

  const removeDuplicateSize = () => {
    let dt = data && data.map((data) => data.size);
    return [...new Set(dt)];
  };

  return (
    <Fragment>
      <Navbar />
      {loading && <LinearProgress color="secondary" />}
      <Container>
        <Box className={classes.box}>
          {data && (
            <Fragment>
              <Autocomplete
                multiple
                options={removeDuplicatesCity()}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                onChange={handleChange}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </React.Fragment>
                )}
                className={classes.filter1}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Filter par ville"
                  />
                )}
              />
              <Autocomplete
                multiple
                options={removeDuplicateSize()}
                disableCloseOnSelect
                getOptionLabel={(option) => option + " pièces"}
                onChange={handleChangeSize}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </React.Fragment>
                )}
                className={classes.filter1}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Filter par taille"
                  />
                )}
              />
            </Fragment>
          )}
        </Box>
        <Grid container spacing={2} className={classes.root}>
          {data &&
            dynamicSearch()
              .slice(lowbound, upbound)
              .map((data) => (
                <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                  <Card
                    key={data._id}
                    onClick={() =>
                      props.history.push(`/appartments/details/${data._id}`)
                    }
                  >
                    <CardHeader
                      subheader={`${moment(data.createdAt).fromNow()}`}
                    />
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={data.picture}
                        title=""
                      />
                      <CardContent className={classes.cardcontent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {data.city}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          {`${data.adress} | ${data.size} pièces`}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
        </Grid>
        <div className={classes.pagination}>
          <Typography>Page: {page}</Typography>
          <Pagination
            style={{ marginBottom: 200 }}
            count={data && pageNumber()}
            page={page}
            onChange={handlePageChange}
          />
        </div>
      </Container>
      {/* <div style={{ height: "5px" }}></div> */}
    </Fragment>
  );
};

export default Main;
