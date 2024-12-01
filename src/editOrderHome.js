import React, { Component, useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import NewOrder from './newOrder'
import Invoice from './invoice'
import Customer from './customers'
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch  } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const location = useLocation();
  const orderID = useParams().orderID
  const checked = useSelector(state=>state.checked)
  const [customerType, setCustomerType] = React.useState("existing")
  const storename = useSelector(state=>state.client)
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue)
    switch(newValue){
        case 0 : 
            navigate(`editOrder/${orderID}`);
            break;
        case 1 : 
            navigate(`/editOrder/${orderID}/selectItems`);
            break;
        case 2 : 
            navigate(`/editOrder/${orderID}/editInvoice`);
            break;
    }
  };
  

  useEffect(()=>{
    switch(location.pathname){
        case "/newOrder": 
            setValue(0)
            break;
        case "/newOrder/selectItems": 
            setValue(1)
            break;
        case "/newOrder/invoice" : 
            setValue(2)
            break;
    }
    
  }, [location]);

  useEffect(()=>{
    // if(storename.name===""){
    //     setValue(0);
    //     navigate("/newOrder")
    //     return;
    //   }
    //   if(!checked.length){
    //       setValue(1)
    //       navigate("/newOrder/selectItems")
    //     toast.error("Please select item first!")
        
    //   }

    
  }, [])
  return (
    <Box sx={{ width: '100%', mt: 10}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-around'}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{display: 'flex', }}>
          <Tab label="Customer Information" {...a11yProps(0)} />
          <Tab label="Select Items" {...a11yProps(1)} />
          <Tab label="View Invoice" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Outlet context={{}}/>
    </Box>
  );
}
