import React from "react";
import { useDispatch } from "react-redux";
import { refreshCheck, setClientName, setClientAddress, setClientBusiness, setClientNumber, setClientReference, updateAllDiscount, updateTotalDiscount } from "../app/features/checked/checkedSlice";
import axios from 'axios'
import { server_url } from "../config";
import { Link, useLocation } from "react-router-dom";
import Cards from '../cards'
import { Box } from "@mui/material";
import {Person, AttachMoney, ShoppingCart, Payment} from '@mui/icons-material';

export default function Dashboard() {
  const dispatch = useDispatch();
  dispatch(refreshCheck());
  dispatch(setClientName(""));
  dispatch(setClientAddress(""));
  dispatch(setClientNumber(""));
  dispatch(setClientReference(""));
  dispatch(setClientBusiness(""));
  dispatch(updateTotalDiscount({ discount: 0 }));
  const [orders, setOrders] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();
  const [totalSales, setTotalSales] = React.useState(0);
  const [due, setDue] = React.useState(0);
  const cardsData = [
    {cardNumber: customers.length, cardName: "No of Customers", iconName: Person},
    {cardNumber: orders.length, cardName: "No of Orders", iconName: ShoppingCart},
    {cardNumber: totalSales, cardName: "Total Sales", iconName: AttachMoney},
    {cardNumber: due, cardName: "Amount Due", iconName: Payment}
];
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  React.useEffect(() => {
    axios
      .get(`${server_url}Order/getOrders`)
      .then((response) => {
        // Handle the response
        setLoading(false)
        setOrders(response.data);
        console.log(response.data)
        setTotalSales(response.data.reduce((prev, current, index)=>{
          return current.amount + prev
        }, 0))
        setDue(response.data.reduce((prev, current, index)=>{
          return (current.amount-current.advance) + prev
        }, 0))
      })
      .catch((error) => {
        // Handle the error
        console.error("There was an error!", error);
      });

      axios
      .get(`${server_url}Client/getCustomers`)
      .then((response) => {
        // Handle the response
        setCustomers(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        // Handle the error
        console.error("There was an error!", error);
      });
  }, [location]);
  return <Box sx={{mt: 12, display: "flex", justifyContent: "space-around"}}><Cards cards={cardsData}/></Box>;
}
