import React from "react";
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
export default function NewCustomer() {
  const [reference, setReference] = React.useState("");
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [business, setBusiness] = React.useState("");
  const dispatch = useDispatch();
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("")

  let customer = {
    name,
    address,
    number,
    reference,
    business,
  };

  const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{9,14})$/;

  const handleNumberChange = (event) => {
    let inputValue = event.target.value;

    // Strip out any non-numeric characters except "+"
    inputValue = inputValue.replace(/[^\d+]/g, "");

    setNumber(inputValue);
    console.log(inputValue.length);
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

  const handleChange = (event) => {
    setReference(event.target.value);
    dispatch(setClientReference(event.target.value));
  };

  return (
    <Box
      sx={{
        mt: 1,
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
      />
      <FormControl fullWidth sx={{ mt: 2, width: 300 }}>
        <InputLabel id="demo-simple-select-label">Reference</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          margin="normal"
          id="demo-simple-select"
          value={reference}
          label="Reference"
          onChange={handleChange}
        >
          <MenuItem value={"Muhammad Sharjeel"}>Muhammad Sharjeel</MenuItem>
          <MenuItem value={"Ali Naqi"}>Ali Naqi</MenuItem>
          <MenuItem value={"Muhammad Zain"}>Muhammad Zain</MenuItem>
          <MenuItem value={"Muhammad Shehroze"}>Shehroze Raza</MenuItem>
          <MenuItem value={"Hasnain Raza"}>Hasnain Raza</MenuItem>
          <MenuItem value={"Sohail Abbas"}>Sohail Abbas</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
