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
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setClient, refreshCheck } from "./app/features/checked/checkedSlice";
import { server_url } from "./config";

export default function ExistingCustomer() {
  const [customers, setCustomers] = React.useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  const [margin, setMargin] = React.useState(0);
  if (location.pathname == "/customers") {
    dispatch(refreshCheck());
    dispatch(setClient({}));
  }
  const customerClicked = (customer) => {
    console.log(customer);
    dispatch(setClient(customer));
    if (location.pathname == "/newOrder") {
      navigate("selectItems");
    }
  };

  useEffect(() => {
    axios
      .get(`${server_url}Client/getCustomers`)
      .then((response) => {
        // Handle the response
        setCustomers(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error("There was an error!", error);
      });
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/newOrder":
        setMargin(0);
        break;
      case "/customers":
        setMargin(10);
        break;
    }
  }, [location]);

  return (
    <List sx={{ width: "100%", mt: margin }}>
      {customers.map((customer) => {
        return (
          <ListItem
            onClick={() => {
              customerClicked(customer);
            }}
            key={customer.name}
            sx={{ padding: 0, paddingBottom: 2 }}
          >
            <ListItemButton
              alignItems="flex-start"
              sx={{
                borderBottom: "1px solid #8080803d",
                boxShadow:
                  "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              }}
            >
              <ListItemText
                primary={customer.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {customer.address}
                    </Typography>
                    <br />
                    {customer.number}
                  </React.Fragment>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
