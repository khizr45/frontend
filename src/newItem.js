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
import { server_url } from "./config";
import { toast, ToastContainer } from "react-toastify";

import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function NewItem() {
    const [name, setName] = React.useState("")
    const [price, setPrice] = React.useState("")
    const navigate = useNavigate();
    axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const postNewItem = () => {
        axios.post(`${server_url}Item/newItem`, {name, price}).then((res)=>{
            if(res.data.message==="successful"){
                toast.success("Item added successfuly",{
                  position:"top-center",
                  hideProgressBar:true,
                  autoClose:3000
                })
                navigate("/items")
            }else{
                console.log(res)
            }
        })
    }
  return(
    <Box
      sx={{
        mt: 1,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        mt: 10,
        maxWidth: 300
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
          setName(event.target.value)
        }}
      />
      <TextField
        margin="normal"
        type="number"
        required
        fullWidth
        name="price"
        label="Price"
        id="price"
        value={price}
        onChange={(event) => {
          setPrice(event.target.value);
          
        }}
      />
      <Button variant="contained" color="success" onClick={postNewItem}>Submit</Button>
    </Box>
  );
};
