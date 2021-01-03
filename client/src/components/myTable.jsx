import React from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Paper,
  makeStyles,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import moment from "moment";
import { TableSkeleton } from "./Skeleton/TableSkeleton";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    width: "100%",
    boxShadow: "none",
  },
  link: {
    textDecoration: "none",
    color: [theme.palette.primary.dark],
  },
  box: {
    paddingTop: 7,
    marginLeft: 10,
    marginBotton: 3,
  },
  paper: {
    width: "100%",
    marginBottom: 20,
    overflow: "hidden",
  },
}));

const MyTable = ({ data, title, link, header, text }) => {
  const classes = useStyles();
  return (
    <div>
      <Paper className={classes.paper}>
        <Box className={classes.box}>
          <Typography variant="h6" color="primary">
            {data ? title : <Skeleton width={"50%"} />}
          </Typography>
        </Box>
        <TableContainer component={Paper} square className={classes.table}>
          <Table>
            <caption style={{ color: "black" }}>
              <Link to={link} className={classes.link}>
                {text}
              </Link>
            </caption>

            <TableHead>
              <TableRow>
                {header.map((header, index) => (
                  <TableCell key={index}>
                    <strong>{header}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data ? (
                data.slice(0, 5).map((data) => (
                  <TableRow key={data._id}>
                    <TableCell component="th" scope="row">
                      {data.tenant.name
                        ? `${data.tenant.name} ${data.tenant.lastname}`
                        : data.tenant}
                    </TableCell>
                    <TableCell>
                      {moment(data.updatedAt).format("DD/MM/YY")}
                    </TableCell>
                    <TableCell>
                      {typeof data.status == "string"
                        ? data.status
                        : data.status.name}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableSkeleton count={3} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/*         <Box className={classes.box}>
          <Typography variant="overline"></Typography>
        </Box> */}
      </Paper>
    </div>
  );
};

export default MyTable;
