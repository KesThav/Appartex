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
  TableFooter,
  Paper,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  link: {
    textDecoration: "none",
    color: "#000000",
  },
}));

const MyTable = ({ data, title, link, header }) => {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h6">{title}</Typography>
      <TableContainer component={Paper} square>
        <Table className={classes.table}>
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
                <TableCell>{data.createdAt}</TableCell>
                <TableCell>{data.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            component={Link}
            to={link}
            className={classes.link}
            style={{ textAlign: "center" }}
          >
            <Typography variant="overline" display="block" gutterBottom>
              Voir tous les {title.split(" ")[1]}
            </Typography>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyTable;
