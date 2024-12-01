import React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import axios from "axios";
import Table from "@mui/material/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Tooltip, Typography, TextField } from "@mui/material";
import { server_url } from "./config";
import { toast } from "react-toastify";

export default function Items() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const allowedExtensions = ["csv"];
  const fileInputRef = React.useRef(null);
  const [count, setCount] = React.useState(0);
  const [editIndex, setEditIndex] = React.useState(null);
  const [name, setName] = React.useState("");
  const [warranty, setWarranty] = React.useState("");
  const [price, setPrice] = React.useState("");
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  const [file, setFile] = React.useState("");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    axios.get(`${server_url}Item/getItems`).then((response) => {
      console.log(response.data);
      // Handle the response
      setItems(response.data);
    });
  }, [count]);

  //file work

  // const handleFileChange = (e) => {

  //   setFile("");

  //   // Check if user has entered the file
  //   if (e.target.files.length) {
  //     const inputFile = e.target.files[0];

  //     // Check the file extensions, if it not
  //     // included in the allowed extensions
  //     // we show the error
  //     const fileExtension = inputFile?.type.split("/")[1];
  //     console.log(fileExtension);
  //     if (!allowedExtensions.includes(fileExtension)) {
  //       setError("Please input a csv file");
  //       return;
  //     }

  //     // If input type is correct set the state
  //     setFile(inputFile);
  //   }
  // };
  // const submitFile = async () => {
  //   fileInputRef.current.click();
  //   await new Promise((resolve) => {
  //     // Polling to check if file is set
  //     const interval = setInterval(() => {
  //       if (file) {
  //         clearInterval(interval);
  //         resolve();
  //       }
  //     }, 100);
  //   });
  //   console.log("hello");
  //   if (file) {
  //     let formData = new FormData();
  //     formData.append("file", file);
  //     const res = await axios.post(
  //       `${server_url}/updateMedicine`,
  //       formData
  //     );
  //     console.log(res);
  //     if (res.data === "itemsUpdated") {
  //       toast.success("items Uploaded");
  //     } else if (res.data === "ordersExist") {
  //       toast.error("orders Exist");
  //     }
  //   } else {
  //     console.log(error);
  //     toast.error(error);
  //   }
  // };

  // Function to handle file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Function to open file dialog and wait for file selection
  const openFileDialog = () => {
    return new Promise((resolve) => {
      fileInputRef.current.onchange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
          resolve(selectedFile);
        } else {
          resolve(null);
        }
      };
      fileInputRef.current.click(); // Open file dialog
    });
  };

  // Function to handle file upload
  const uploadFile = async (file) => {
    let formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${server_url}Item/updateMedicine`, formData);
      console.log(res);
      if (res.data.message === "Items updated successfully") {
        setCount(count + 1);
        toast.success("Items Uploaded",{
          position:"top-center",
          hideProgressBar:true,
          autoClose:3000
        });
        fileInputRef.current.value = "";
        setCount(count - 1);
      } else {
        toast.error("Orders Exist",{
          position:"top-center",
          hideProgressBar:true,
          autoClose:3000
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading file");
    }
  };

  // Main function to handle file upload
  const submitFile = async () => {
    const selectedFile = await openFileDialog();
    if (selectedFile) {
      console.log("file selected");
      await uploadFile(selectedFile);
    } else {
      toast.error("No file selected");
    }
  };

  const editClick = (index, row) => {
    setEditIndex(index);
    setName(row.name);
    setWarranty(row.warranty);
    setPrice(row.price);
  };

  const editItem = (itemID) => {
    axios
      .post(`${server_url}Item/editItem`, {
        itemID: itemID,
        name: name,
        price: price,
      })
      .then((res) => {
        if (res.data.message == "success") {
          toast.success("Item Edited Successfuly!",{
            position:"top-center",
            hideProgressBar:true,
            autoClose:3000
          });
          setCount(count + 1);
        } else {
          console.log(res.data);
        }
      });
    setEditIndex(null);
  };

  const deleteItem = (row) => {
    console.log(row.itemID);
    axios
      .post(`${server_url}Item/deleteItem`, { itemID: row.itemID })
      .then((res) => {
        console.log(res);
        if (res.data.message == "Item deleted successfully") {
          toast.success("Item deleted successfuly!",{
            position:"top-center",
            hideProgressBar:true,
            autoClose:3000
          });
          setCount(count + 1);
        } else {
          console.log(res.data);
          toast.error("Item already exists in order!",{
            position:"top-center",
            hideProgressBar:true,
            autoClose:3000
          });
        }
      });
  };
  return (
    <>
      <input
        onChange={handleFileChange}
        id="csvInput"
        ref={fileInputRef}
        name="file"
        type="File"
        style={{ display: "none" }}
      />
      <TableContainer
        component={Paper}
        sx={{ mt: 10, maxHeight: window.innerHeight - 120 }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">
                <Button variant="contained" onClick={submitFile}>
                  Upload
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {editIndex == index ? (
                    <TextField
                      margin="normal"
                      id="name"
                      label="Name"
                      name="Name"
                      value={name}
                      autoFocus
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
                  ) : (
                    row.name
                  )}
                </TableCell>
                <TableCell align="right">
                  {editIndex == index ? (
                    <TextField
                      margin="normal"
                      id="price"
                      label="Price"
                      name="Price"
                      value={price}
                      autoFocus
                      onChange={(event) => {
                        setPrice(event.target.value);
                      }}
                    />
                  ) : (
                    row.price.toLocaleString()
                  )}
                </TableCell>
                <TableCell align="right">
                  {editIndex == index ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        editItem(row.itemID);
                      }}
                    >
                      Save
                    </Button>
                  ) : (
                    <Tooltip title="edit" placement="bottom">
                      <IconButton
                        onClick={() => {
                          editClick(index, row);
                        }}
                      >
                        <EditIcon sx={{ color: "#1976d2" }} />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="delete" placement="bottom">
                    <IconButton
                      onClick={() => {
                        deleteItem(row);
                      }}
                    >
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                {/* <Menu
                    id="fade-menu"
                    // MenuListProps={{
                    //   "aria-labelledby": "fade-button",
                    // }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                    sx={{
                      "& .MuiPaper-root": {
                        boxShadow: "none", // Removes the box shadow
                        border: "1px solid #e0e0e0", // Optional: Adds a very light border
                        padding: "0", // Removes extra padding
                        backgroundColor: "#fff", // Simple white background
                      },
                    }}
                  >
                    <MenuItem onClick={handleClose}><EditIcon /></MenuItem>
                    <MenuItem onClick={handleClose}><DeleteIcon /></MenuItem>
                    
                  </Menu> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to="/newItem">
        <Fab
          color="primary"
          variant="extended"
          aria-label="add"
          sx={{ bottom: 50, right: 40, position: "fixed", zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </>
  );
}
