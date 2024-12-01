import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { InputBase } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateDiscount, updateAllDiscount } from "./app/features/checked/checkedSlice";

export default function BasicTable({ discount, setDiscount }) {
  const checked = useSelector((state) => state.checked);
  const dispatch = useDispatch();
  const changeDiscount = function(e, index){
    dispatch(updateDiscount({index, discount: e.target.value}))
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow sx={{ bgcolor: "#1976d2" }}>
            <TableCell sx={{ color: "white" }}>Name</TableCell>
            <TableCell sx={{ color: "white" }} align="right">
              Selling Price
            </TableCell>
            <TableCell sx={{ color: "white" }} align="right">
              Discounted Price
            </TableCell>
            <TableCell sx={{ color: "white" }} align="right">
              Discount
            </TableCell>
            <TableCell sx={{ color: "white" }} align="right">
              Quantity
            </TableCell>
            <TableCell sx={{ color: "white" }} align="right">
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checked.map((row, index) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.costPrice}</TableCell>
              <TableCell align="right">{row.sellingPrice}</TableCell>
                <TableCell
                  align="right"
                >
                  <InputBase
                    sx={{
                      "& input[type=number]": {
                        width: "4em",
                        textAlign: "center",
                        MozAppearance: "textfield",
                        appearance: "textfield",
                        "&::-webkit-outer-spin-button": {
                          display: "none",
                        },
                        "&::-webkit-inner-spin-button": {
                          display: "none",
                        },
                      },
                    }}
                    type="number"
                    value={row.discount}
                    onChange={(e) => {
                      changeDiscount(e, index);
                    }}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{(row.sellingPrice * row.quantity).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
