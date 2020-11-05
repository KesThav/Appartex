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
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
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
}));

const MyTable = ({ data, title, link, header }) => {
  const classes = useStyles();
  return (
    <div>
      <Paper>
        <Box className={classes.box}>
          <Typography variant="h6" color="primary">
            {title}
          </Typography>
        </Box>
        <TableContainer component={Paper} square className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                {header.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, 5).map((data) => (
                <TableRow key={data._id}>
                  <TableCell component="th" scope="row">
                    {data._id}
                  </TableCell>
                  <TableCell>
                    {moment(data.updatedAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {typeof data.status == "string"
                      ? data.status
                      : data.status.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className={classes.box}>
          <Typography variant="overline">
            <Link to={link} className={classes.link}>
              Voir tous les {title.split(" ")[1]}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default MyTable;
