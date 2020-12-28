import React, { Fragment } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { Table, TableRow, TableCell, TableBody } from "@material-ui/core";

export const TableSkeleton = ({ count }) => {
  let data = [];
  let row = [];
  for (let i = 0; i < count; i++) {
    data.push(i);
  }
  for (let j = 0; j < 6; j++) {
    row.push(
      <TableRow>
        {data.map((data) => (
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    );
  }
  return <Fragment>{row}</Fragment>;
};
