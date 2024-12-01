import React, { useEffect } from "react";
import axios from "axios";
import { server_url } from "./config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  setClientName,
  setClientAddress,
  setClientBusiness,
  setClientReference,
  setClientNumber,
} from "./app/features/checked/checkedSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
export default function NewCustomer() {
  const navigate = useNavigate();
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  const dispatch = useDispatch();
  const customerID = useParams().customerId;
  const client = useSelector(state => state.client);

    

  

  return (
    <Box
      sx={{
        mt: 10,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="Name"
        value={client.name}
        autoFocus
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="address"
        label="Address"
        id="address"
        value={client.address}
        
        InputProps={{
          readOnly: true
        }}
      />
      <TextField
        margin="normal"
        required
        sx={{ width: 300 }}
        name="number"
        label="Number"
        value={client.number}
        id="number"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        margin="normal"
        required
        sx={{ width: 300 }}
        name="business"
        label="Business"
        value={client.business}
        id="business"
        
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        value={client.reference}
        InputProps={{
          readOnly: true, // Makes it read-only
        }}
        variant="outlined"
        label="Reference"
        margin="normal"
        required
        sx={{ width: 300 }}
      />
    </Box>
  );
}
