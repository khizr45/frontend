import React, { useState } from "react";
import Alert from "@mui/material/Alert";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import Zoom from "@mui/material/Zoom";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "./app/features/checked/checkedSlice";
import { setUser } from "./app/features/checked/checkedSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const defaultTheme = createTheme();

export default function Admin() {
  const [error, setError] = useState("");
  const allowedExtensions = ["csv"];
  const [value, setValue] = useState();

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    if (password.length < 7 || password.length > 13) {
      toast.error("Password out of range(8-12).");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password doesnt match.");
      return;
    }
    axios
      .post("http://localhost:8081/createSalesman", {
        username: data.get("username"),
        password: data.get("password"),
        name: data.get("name"),
      })
      .then((res) => {
        console.log(res.data);
        if (res.data !== "failure") {
          toast.success("Salesman created!");
        } else {
          toast.error("Username already exist!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileChange = (e) => {
    setFile("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      console.log(fileExtension);
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };
  const submitFile = async () => {
    console.log("hello");
    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        "http://localhost:8081/updateMedicine",
        formData
      );
      console.log(res);
      if (res.data === "medicinesUpdated") {
        toast.success("Medicines Updated");
      } else if (res.data === "bookingExist") {
        toast.error("orders Exist");
      }
    } else {
      console.log(error);
      toast.error(error);
    }
  };

  const getOrderCsv = async () => {
    const day = dayjs(value).format("YYYY-MM-DD");
    const response = await axios.post(
      "http://localhost:8081/getBooking",
      { date: day },
      {
        responseType: "blob", // Specify the response type as blob
      }
    );

    // Create a Blob URL for the downloaded file
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a link and trigger a click event to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_data.csv";
    document.body.appendChild(a);
    a.click();

    // Remove the link after the download is complete
    document.body.removeChild(a);

    // Revoke the Blob URL to free up resources
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <ToastContainer />
      <div>
        <label>Enter CSV file of medicines : </label>
        <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
        />
        <button onClick={submitFile}>Submit Csv</button>
      </div>
      <div>
        <label>Enter a date to get orders csv : </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Controlled picker"
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>
        <button onClick={getOrderCsv}>Get Csv</button>
      </div>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}
