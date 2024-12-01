import React, { useEffect } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "axios";
import ExistingCustomer from './existingCustomers'
import NewCustomer from "./newCustomer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setClient } from "./app/features/checked/checkedSlice";






export default function Customers() {
  const [customer, setCustomer] = React.useState("existing");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleAlignment = (event, customerType) => {
    setCustomer(customerType);
    if(customerType=="new"){
      dispatch(setClient({}))
    }
  };

  
  return (
    <>
      <ToggleButtonGroup
        value={customer}
        exclusive
        onChange={handleAlignment}
        aria-label="customer type"
        sx={{mt:3}}
      >
        <ToggleButton value="existing" aria-label="existing customer">
          Existing Customer
        </ToggleButton>
        <ToggleButton value="new" aria-label="new customer">
          New Customer
        </ToggleButton>
      </ToggleButtonGroup>
      <div>
        {customer == "existing" ? <ExistingCustomer /> : <NewCustomer />}
      </div>
    </>
  );
}
