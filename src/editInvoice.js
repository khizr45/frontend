import React, { Component, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./home.css";
import Alert from "@mui/material/Alert";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  Link,
  unstable_useViewTransitionState,
  useNavigate,
} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Zoom from "@mui/material/Zoom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import MenuIcon from "@mui/icons-material/Menu";
import { Input, Table, TableContainer, InputBase } from "@mui/material";
import InvoiceTable from "./invoiceTable";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import {
  refreshCheck,
  setClientName,
  setClientAddress,
  setClientBusiness,
  setClientNumber,
  setClientReference,
  updateTotalDiscount,
} from "./app/features/checked/checkedSlice";
import { server_url } from "./config";
export default function App() {
  const navigate = useNavigate();
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  const checked = useSelector((state) => state.checked);
  const user = {
    name: localStorage.getItem("name"),
    username: localStorage.getItem("username"),
  };
  const dispatch = useDispatch();
  const client = useSelector((state) => state.client);
  var todayDate = new Date().toISOString().slice(0, 10);
  const [total, setTotal] = useState(0);
  const discount = useSelector((state) => state.discount);
  const orderID = useParams();

  useEffect(() => {
    console.log("hello");
    console.log(client);
    if (client.name === "" || Object.keys(client).length == 0) {
      console.log("helloIF");
      toast.error("Please select client first!");
      navigate("/newOrder");
    } else if (!checked.length) {
      toast.error("Please select medicine first!");
      navigate("/newOrder/selectItems");
    }
  }, []);
  const submit = () => {
    console.log(orderID);
    axios
      .post(`${server_url}Order/editOrder`, {
        orderID: orderID.orderID,
        clientID: client.clientID,
        name: client.name,
        address: client.address,
        number: client.number,
        business: client.business,
        reference: client.reference,
        total,
        date: todayDate,
        checked,
        discount,
      })
      .then((res) => {
        if (res.data.message == "successful") {
          toast.success("Order edited successfuly!",{
            position:"top-center",
            hideProgressBar:true,
            autoClose:3000,
          });
          navigate("/orders")
        } else {
          console.log(res.data);
          return res.data;
        }
      });
  };
  const getTotal = () => {
    let sum = 0;
    checked.forEach((value) => {
      sum += value.quantity * value.sellingPrice;
    });
    setTotal(sum);
  };
  useEffect(getTotal, [discount, checked]);
  const changeDiscount = function (e) {
    dispatch(updateTotalDiscount({ discount: e.target.value }));
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "90%",
          display: "flex",
          marginTop: "15px",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography>Client Name: {client.name}</Typography>
          <Typography>Name: {user.name}</Typography>
          <Typography>Date: {todayDate}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: "90%",
          marginTop: "15px",
        }}
      >
        <InvoiceTable discount={discount} total />
      </Box>
      <Box
        sx={{
          width: "90%",
          marginTop: "15px",
          display: "flex",
        }}
      >
        <Table sx={{ minWidth: "200px", width: "31%" }}>
          <TableRow>
            <TableCell
              size="small"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                bgcolor: "#1976d2",
                color: "white",
                textAlign: "center",
              }}
            >
              Total
            </TableCell>
            <TableCell
              size="small"
              align="center"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                width: "50%",
              }}
            >
              {total} Rs
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              size="small"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                bgcolor: "#1976d2",
                color: "white",
                textAlign: "center",
              }}
            >
              Discount
            </TableCell>
            <TableCell
              size="small"
              align="center"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InputBase
                sx={{
                  "& input[type=number]": {
                    default: 0,
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
                value={discount}
                onChange={(e) => {
                  changeDiscount(e);
                }}
                inputProps={{ min: 0 }}
              />
              %
            </TableCell>
          </TableRow>
        </Table>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "flex-end",
          }}
        >
          <Button
            sx={{ bgcolor: "#1976d2", color: "white" }}
            variant="contained"
            onClick={submit}
          >
            Edit Order
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
