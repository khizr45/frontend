import React, { Component, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./home.css";
import Alert from "@mui/material/Alert";
import Fab from '@mui/material/Fab';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {Link} from 'react-router-dom'
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DraftsIcon from "@mui/icons-material/Drafts";
import { Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import QuantityInput from "./quantityPicker";
import {useDispatch, useSelector} from 'react-redux';
import {updateChecked, updateQuantity} from './app/features/checked/checkedSlice';
import { ToastContainer } from "react-toastify";
import { server_url } from "./config";


function SelectMedicine() {
  axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('token')}`;
  const todayDate = new Date().toISOString().slice(0, 10);
  const checked = useSelector(state => state.checked);
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [medicines, setMedicines] = useState([]);

  const handleSubmit1 = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axios
      .post(`${server_url}Item/getMedicine`, {
        name: data.get("medicalStore"),
      })
      .then((res) => {
        if (res.data != "empty") {
          setMedicines(res.data);
        }
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postRequest = (event) => {
    setValue(event.target.value);
    if (event.target.value) {
      try{
      axios
        .post(`${server_url}Item/getMedicine`, { name: event.target.value })
        .then((res) => {
          if (res.data.message != "empty") {
            const newArray = [];
            let checkedValue = false;
            res.data.map((value) => {
              checked.forEach((element) => {
                if (element.name === value.name) {
                  checkedValue = true;
                  console.log(element.name + value.name);
                }
                console.log(element.name);
              });
              let object = {
                name: value.name,
                price: value.price,
                itemID: value.itemID,
                checked: checkedValue,
              };
              console.log(object)
              newArray.push(object);
              checkedValue = false;
            });
            setMedicines(newArray);
          }
        })}
        catch(error) {
          console.log(error, "error");
        };
    } else {
      setMedicines([]);
    }
  };
  const handleToggle = (value, index) => () => {
    const array = [...medicines];
    dispatch(updateChecked(value));
    array[index].checked = !array[index].checked;
    setMedicines(array);
  };

  const quantityChange = (index, quantity) => {
    dispatch(updateQuantity({index, quantity}))
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
     

      <Box component="form" onSubmit={handleSubmit1} noValidate>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon color="inherit" sx={{ display: "block" }} />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Search Items"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: "default" },
                  }}
                  value={value}
                  variant="standard"
                  id="medicalStore"
                  name="medicalStore"
                  autoFocus
                  onChange={postRequest}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" sx={{ mr: 1 }} type="submit">
                  Search
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
      <List
        dense
        sx={{
          width: "100%",
          maxWidth: 360,
          maxHeight: 300,
          overflow: "auto",
          // position: "absolute", 
        }}
      >
        {medicines.map((value, index) => {
          const labelId = `checkbox-list-secondary-label-${value}`;
          return (
            <ListItem
              key={value.name}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggle(value, index)}
                  checked={value.checked}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              }
              disablePadding
            >
              <ListItemButton onClick={handleToggle(value, index)}>
                <ListItemText id={labelId} primary={value.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <TableContainer
        sx={{ display: "flex", justifyContent: "center", overflow: "auto" }}
      >
        <Table
          sx={{
            minWidth: 650,
            maxWidth: 500,
            maxHeight: 300,
            overflow: "auto",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right" sx={{ marginRight: 40 }}>
                Quantity
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
                <TableCell align="right">
                  <QuantityInput
                    quantity={row.quantity}
                    quantityChange={(val) => {
                      quantityChange(index, val);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default SelectMedicine;
