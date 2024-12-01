import React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import { Box, ListItemButton, Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import zIndex from "@mui/material/styles/zIndex";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Tooltip, IconButton } from "@mui/material";
import OrderInvoiceTable from "./orderInvoiceTable";
import { Button, Table, TableRow, TableCell } from "@mui/material";
import { refreshCheck, setClientAddress, setClientBusiness, setClientName, setClientNumber, setClientReference, updateTotalDiscount } from "./app/features/checked/checkedSlice";
import { server_url } from "./config";
import Skeleton from "@mui/material/Skeleton";

export default function Orders() {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  const [refreshNumber, setRefresghNumber] = React.useState(0)
  const dispatch = useDispatch();
  const location = useLocation();
  dispatch(refreshCheck());
  dispatch(setClientName(""));
  dispatch(setClientAddress(""));
  dispatch(setClientNumber(""));
  dispatch(setClientReference(""));
  dispatch(setClientBusiness(""));
  dispatch(updateTotalDiscount({ discount: 0 }));
  const orderClicked = (order) => {
    // console.log(customer);
    // dispatch(setClient(customer));
  };

  useEffect(() => {
    axios
      .get(`${server_url}Order/getOrders`)
      .then((response) => {
        console.log(response.data);
        // Handle the response
        setLoading(false)
        setOrders(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error("There was an error!", error);
      });
  }, [location, refreshNumber]);

  return (
    <>
      <List sx={{ width: "100%", mt: 10 }}>
        {orders.map((order) => {
          const dateStr = order.date;
          const date = new Date(dateStr);

          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          return (
            <Accordion sx={{ bgcolor: "inherit" }}>
              <AccordionSummary
                expandIcon={
                  <Tooltip arrow placement="bottom" title="view">
                    <IconButton>
                      <ExpandMoreIcon />
                    </IconButton>
                  </Tooltip>
                }
              > 
                <ListItem key={order.orderID}>
                  <ListItemText
                    primary={order.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {order.address}
                        </Typography>
                        <br />
                        {formattedDate}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </AccordionSummary>
              <AccordionDetails>
                <OrderInvoiceTable order={order} orderID={order.orderID} discount={order.discount} refreshNumber={refreshNumber} setRefreshNumber={setRefresghNumber}/>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </List>
      <Link to="/newOrder">
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
