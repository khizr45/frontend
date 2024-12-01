import * as React from "react";
import { Table, Box, Button, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server_url } from "./config";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  setClientAddress,
  setClientBusiness,
  setClientName,
  setClientNumber,
  setClientReference,
  setChecked,
  setDiscount,
} from "./app/features/checked/checkedSlice";
import jsPDF from "jspdf";
export default function BasicTable({
  order,
  orderID,
  discount,
  refreshNumber,
  setRefreshNumber,
}) {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState(false);

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  const deleteOrder = function () {
    axios
      .post(`${server_url}Order/deleteOrder`, { orderID })
      .then((response) => {
        const res = response.data.message;
        if (res == "successfull") {
          toast.success("Order Deleted Successfuly!",{
            position:"top-center",
            hideProgressBar:true,
            autoClose:3000
          });
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  React.useEffect(() => {
    axios
      .post(`${server_url}Order/getOrderDetails`, { orderID })
      .then((response) => {
        const ordersData = response.data;
        console.log(ordersData);
        setOrders(response.data);
        const calculatedTotal = ordersData.reduce(
          (acc, element) =>
            acc + parseInt(element.price) * parseInt(element.quantity),
          0
        );
        setTotal(calculatedTotal);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const recieveAmount = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log(order);
    console.log("User input: ", inputValue);
    // Do something with the inputValue, like submitting it to the server
    if (inputValue > total - order.advance) {
      setInputValue("");
      toast.error("Amount exceeding limit!");
      return;
    }
    axios
      .post(`${server_url}Order/receiveAmount`, { orderID: orderID, amount: inputValue })
      .then((res) => {
        if (res.data.message == "successful") {
          toast.success("Amount recieve Successfuly!",{
            position:"top-center",
            hideProgressBar:true,
            autoClose:3000
          });
          setInputValue("");
          setRefreshNumber(refreshNumber + 1);
        } else {
          console.log(res.data);
        }
      });
    setOpen(false);
  };

  const editOrder = () => {
    console.log(order, orders);
    dispatch(setClientAddress(order.address));
    dispatch(setClientBusiness(order.business));
    dispatch(setClientName(order.name));
    dispatch(setClientNumber(order.number));
    dispatch(setClientReference(order.reference));
    let checked = [];
    orders.map((order) => {
      console.log(order);
      checked.push({
        name: order.itemName,
        itemID: order.itemID,
        sellingPrice: order.price,
        costPrice: order.price / (1 - order.discount / 100),
        checked: true,
        quantity: order.quantity,
        discount: order.discount,
      });
    });

    dispatch(setChecked(checked));
    dispatch(setDiscount(order.discount));
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();

    const imgWidth = 30;  // Set width
    const imgHeight = 20; // Set height
    doc.addImage('/vortexLogo.jpg', 'JPG', 15, 10, imgWidth, imgHeight); // Position: (x=15, y=10)

// Add Logo and Header (Optional - use colors)
// doc.setTextColor(0, 102, 204); // Blue text for header
// doc.setFontSize(16);
// doc.text('Invoice', 15, 20);

// Customer Details Section
doc.setTextColor(0, 0, 0); // Black text for details
doc.setFontSize(12);
doc.text('Customer Details:', 15, 70);
doc.text(`Name: ${order.name || 'N/A'}`, 15, 80);
doc.text(`Address: ${order.address || 'N/A'}`, 15, 90);
doc.text(`Phone: ${order.number || 'N/A'}`, 15, 100);
doc.text(`Date: ${order.date ? order.date.split("T")[0] : 'N/A'}`, 15, 110);

// Table Header with Background Color
doc.setFillColor(200, 230, 255); // Light blue background
doc.rect(15, 135, 180, 10, 'F'); // Draw filled rectangle for table header
doc.setTextColor(0, 0, 0); // Black text
doc.setFontSize(10);
doc.text('Name', 15, 140);
doc.text('Price', 70, 140);
doc.text('Quantity', 100, 140);
doc.text('Discount', 130, 140);
doc.text('Total', 160, 140);

// Table Content with Alternating Row Colors
let currentY = 150;
orders.forEach((item, index) => {
  if (index % 2 === 0) {
    doc.setFillColor(240, 240, 240); // Light gray for even rows
    doc.rect(15, currentY - 7, 180, 10, 'F'); // Fill row background
  }

  doc.setTextColor(0, 0, 0); // Reset text color
  const { itemName, price, quantity, discount } = item;
  doc.text(itemName || 'N/A', 15, currentY);
  doc.text(price?.toString() || '0', 70, currentY);
  doc.text(quantity?.toString() || '0', 100, currentY);
  doc.text(discount?.toString() || '0%', 130, currentY);
  doc.text((price * quantity)?.toString() || '0', 160, currentY);
  currentY += 10;
});

// Payment Details with Color Highlights
currentY += 10;
const advance = orders[0]?.advance || 0;
const total = orders.reduce((acc, item) => acc + item.price * item.quantity, 0);

if (advance === total) {
  doc.setTextColor(0, 153, 51); // Green for cleared payments
  doc.text(`Total: ${total.toString()} Rs`, 15, currentY);
  doc.text('Payment Cleared', 15, currentY + 10);
} else {
  doc.setTextColor(204, 0, 0); // Red for due amounts
  doc.text(`Advance: ${advance.toString()} Rs`, 15, currentY);
  doc.text(`Total: ${total.toString()} Rs`, 15, currentY + 10);
  doc.text(`Due: ${(total - advance).toString()} Rs`, 15, currentY + 20);
}

// Save PDF
doc.save(order.orderID.toString() + '.pdf');
  };
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#1976d2" }}>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }} align="right">
                Price
              </TableCell>
              <TableCell sx={{ color: "white" }} align="right">
                Quantity
              </TableCell>
              <TableCell sx={{ color: "white" }} align="right">
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                key={order.name}
              >
                <TableCell component="th" scope="row">
                  {order.itemName}
                </TableCell>
                <TableCell align="right">
                  {order.price.toLocaleString()}
                </TableCell>

                <TableCell align="right">{order.quantity}</TableCell>
                <TableCell align="right">
                  {(order.price * order.quantity).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          width: "31%",
          marginTop: "15px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table sx={{ minWidth: "200px", width: "100%" }}>
          <TableRow>
            <TableCell
              size="small"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                bgcolor: "#1976d2",
                color: "white",
                textAlign: "center",
              }}
            >
              Discount
            </TableCell>
            <TableCell
              size="small"
              align="center"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                width: "50%",
              }}
            >
              {discount} %
            </TableCell>
          </TableRow>
          {total > order.advance ? (
            <>
              <TableRow>
                <TableCell
                  size="small"
                  sx={{
                    border: "1px solid rgba(224, 224, 224, 1)",
                    bgcolor: "green",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Paid
                </TableCell>
                <TableCell
                  size="small"
                  align="center"
                  sx={{
                    border: "1px solid rgba(224, 224, 224, 1)",
                    width: "50%",
                  }}
                >
                  {order.advance.toLocaleString()} Rs
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  size="small"
                  sx={{
                    border: "1px solid rgba(224, 224, 224, 1)",
                    bgcolor: "red",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Due
                </TableCell>
                <TableCell
                  size="small"
                  align="center"
                  sx={{
                    border: "1px solid rgba(224, 224, 224, 1)",
                    width: "50%",
                  }}
                >
                  {(total - order.advance).toLocaleString()} Rs
                </TableCell>
              </TableRow>
            </>
          ) : (
            <></>
          )}

          <TableRow>
            <TableCell
              size="small"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                bgcolor: "#1976d2",
                color: "white",
                textAlign: "center",
              }}
            >
              Total
            </TableCell>
            <TableCell
              size="small"
              align="center"
              sx={{
                border: "1px solid rgba(224, 224, 224, 1)",
                width: "50%",
              }}
            >
              {total.toLocaleString()} Rs
            </TableCell>
          </TableRow>
        </Table>
        {total <= order.advance ? (
          <Box
            sx={{
              border: "1px solid rgba(224, 224, 224, 1)",
              bgcolor: "green",
              color: "white",
              textAlign: "center",
            }}
          >
            Payment Recieved
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
        <Tooltip title="Delete" placement="top">
          <IconButton
            onClick={() => {
              deleteOrder();
            }}
          >
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </Tooltip>
        {total > order.advance ? (
          <Button
            sx={{ bgcolor: "#1976d2", color: "white", ml: 2 }}
            variant="contained"
            onClick={recieveAmount}
          >
            Recieve
          </Button>
        ) : (
          <></>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              fullWidth
              variant="outlined"
              type="number"
              error={error}
              helperText={error ? "Amount Exceeding Total!" : ""}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value > total - order.advance) {
                  setError(true);
                } else {
                  setError(false);
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{ color: "red" }} onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Recieve</Button>
          </DialogActions>
        </Dialog>

        <Link to={`/editOrder/${orderID}`}>
          <Button
            sx={{ bgcolor: "#1976d2", color: "white", ml: 2 }}
            variant="contained"
            onClick={editOrder}
          >
            Edit Order
          </Button>
        </Link>
        <Button
          sx={{ bgcolor: "#1976d2", color: "white", ml: 2 }}
          variant="contained"
          onClick={downloadPDF}

          // onClick={submit}
        >
          Print Invoice
        </Button>
      </Box>
    </Box>
  );
}
