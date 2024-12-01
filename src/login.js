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
import { server_url } from "./config";
import { toast, ToastContainer } from "react-toastify";

const defaultTheme = createTheme();

export default function SignIn(props) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);

  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axios
      .post(`${server_url}user/login`, {
        username: data.get("username"),
        password: data.get("password")
      })
      .then((res) => {
        console.log(res.data);
        if (res.data !== "failure" && res.data !== "error") {
          console.log(res.data);
          dispatch(setToken(res.data.accessToken));
          dispatch(
            setUser({ username: res.data.username, name: res.data.name })
          );
          localStorage.setItem('username', res.data.username)
          localStorage.setItem('name', res.data.name)
          localStorage.setItem('token', res.data.accessToken)
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${localStorage.getItem("token")}`;
          toast.success("Login Successfull",{
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true
          })
          setTimeout(()=>{
            navigate("/");
          },3000)
        } else {
          setAlert(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  

  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Zoom in={alert}>
            <Alert severity="error">Invalid username or password!</Alert>
          </Zoom>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
