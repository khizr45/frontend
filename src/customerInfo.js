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
import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
export default function NewCustomer() {
  const [reference, setReference] = React.useState("");
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [business, setBusiness] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const navigate = useNavigate();
  const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{9,14})$/;

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  const dispatch = useDispatch();
  const customerID = useParams().customerId;
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  useEffect(() => {
    axios
      .post(`${server_url}Client/customerInfo`, { customerID: customerID.toString() })
      .then((res, err) => {
        if (err) {
          return err;
        } else {
          setName(res.data.name);
          setAddress(res.data.address);
          setReference(res.data.reference);
          setNumber(res.data.number);
          setBusiness(res.data.business);
        }
      });
    axios.get(`${server_url}User/getUsers`).then((res, err) => {
      if (err) {
        return err;
      } else {
        setUsers(res.data);
        console.log(res.data);
      }
    });
  }, []);

  const handleNumberChange = (event) => {
    let inputValue = event.target.value;

    // Strip out any non-numeric characters except "+"
    inputValue = inputValue.replace(/[^\d+]/g, "");

    setNumber(inputValue);
    console.log(inputValue.length)
    if (inputValue.length < 11) {
        setError(true);
        setErrorMessage("Phone number must be at least 11 digits.");
      } else if (!phoneRegex.test(inputValue)) {
        setError(true);
        setErrorMessage("Invalid phone number format.");
      } else {
        setError(false);
        setErrorMessage("");
        dispatch(setClientNumber(inputValue)); // Dispatch valid number to Redux
      }
  };

  
  let customer = {
    name,
    address,
    number,
    reference,
    business,
  };
 

  const editCustomer = () => {
    axios
      .post(`${server_url}Client/editCustomer`, {
          name: name,
          address: address,
          number: number,
          reference: reference,
          business: business,
          customerID: customerID.toString(),
      })
      .then((res, err) => {
        if (err) {
          console.log(err);
          return err;
        } else {
          console.log(res.data);
          if (res.data.message == "success") {
            toast.success("Customer edited successfuly!",{
              position: "top-center",
              hideProgressBar:true,
              autoClose:3000
            });
            navigate("/customers");
          }
        }
      });
  };

  return (
    <>
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
          value={name}
          autoFocus
          onChange={(event) => {
            setName(event.target.value);
            dispatch(setClientName(event.target.value));
          }}
          InputProps={{
            readOnly: disabled,
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="address"
          label="Address"
          id="address"
          value={address}
          onChange={(event) => {
            setAddress(event.target.value);
            dispatch(setClientAddress(event.target.value));
          }}
          InputProps={{
            readOnly: disabled,
          }}
        />
        <TextField
          margin="normal"
          required
          sx={{ width: 300 }}
          name="number"
          label="Number"
          value={number}
          id="number"
          error={error} // Show error state if validation fails
          helperText={error ? errorMessage : ""}
          onChange={handleNumberChange}
          InputProps={{
            readOnly: disabled,
          }}
        />
        <TextField
          margin="normal"
          required
          sx={{ width: 300 }}
          name="business"
          label="Business"
          value={business}
          id="business"
          onChange={(event) => {
            setBusiness(event.target.value);
            dispatch(setClientBusiness(event.target.value));
          }}
          InputProps={{
            readOnly: disabled,
          }}
        />

        <TextField
          select
          value={reference}
          InputProps={{
            readOnly: disabled, // Makes it read-only
          }}
          variant="outlined"
          label="Reference"
          margin="normal"
          required
          sx={{ width: 300 }}
          onChange={(e) => {
            setReference(e.target.value);
          }}
        >
          {users.map((user) => (
            <MenuItem key={user.name} value={user.name}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        {disabled ? (
          <Button
            variant="contained"
            onClick={() => {
              setDisabled(false);
            }}
          >
            Edit
          </Button>
        ) : (
          <Button variant="contained" color="success" onClick={editCustomer}>
            Save
          </Button>
        )}
      </Box>
    </>
  );
}
