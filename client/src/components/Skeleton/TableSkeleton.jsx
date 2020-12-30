import React, { Fragment } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  TableRow,
  TableCell,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("sm")]: {
    trow: {
      "&:nth-child(even)": {
        backgroundColor: "#eceff1",
      },
      display: "block",
      width: "100%",
    },
    tcell: {
      overflowWrap: "break-word",
      display: "block",
      width: "100%",
      textAlign: "right",
      position: "relative",
    },
  },
}));

export const TableSkeleton = ({ count }) => {
  const classes = useStyles();
  let data = [];
  let row = [];
  for (let i = 0; i < count; i++) {
    data.push(i);
  }
  for (let j = 0; j < 6; j++) {
    row.push(
      <TableRow className={classes.trow}>
        {data.map((data) => (
          <TableCell className={classes.tcell}>
            <Skeleton animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    );
  }
  return <Fragment>{row}</Fragment>;
};
