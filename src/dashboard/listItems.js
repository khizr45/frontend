import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        <ListItemButton>
        <ListItemIcon>
            <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
        </ListItemButton>
    </Link>
    <Link to="/orders" style={{ color: 'inherit', textDecoration: 'none' }}>
        <ListItemButton>
        <ListItemIcon>
            <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
        </ListItemButton>
    </Link>
    <Link to="/customers" style={{ color: 'inherit', textDecoration: 'none' }}> 
        <ListItemButton>
        <ListItemIcon>
            <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
        </ListItemButton>
    </Link>
    <Link to="/items" style={{ color: 'inherit', textDecoration: 'none' }}>
    <ListItemButton>
      <ListItemIcon>
       <InventoryIcon />
      </ListItemIcon>
      <ListItemText primary="Items" />
    </ListItemButton>
    </Link>
    
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Accounts
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);