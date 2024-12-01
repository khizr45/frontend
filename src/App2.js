import React from 'react'
import Login from './login';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
function App2() {
  return (
    <>

      <Outlet />
    </>
  )
}

export default App2
