import { createSlice } from "@reduxjs/toolkit";
import { difference } from "d3";

const initialState = {
  checked: [],
  user: { name: "", userName: "" },
  client: { name: "", address: "", reference: "", number: "", business: "" },
  token: "",
  discount: 0,
  orderSubmitted: false,
};

export const checkedSlice = createSlice({
  name: "checked",
  initialState,
  reducers: {
    refreshCheck: (state, action) => {
      state.checked = [];
    },
    updateChecked: (state, action) => {
      const value = action.payload;
      if (value.checked) {
        let index2 = -1;
        state.checked.forEach((element, index) => {
          if (value.name === element.name) {
            index2 = index;
          }
        });
        if (index2 > -1) {
          state.checked.splice(index2, 1);
        }
      } else {
        state.checked.push({
          name: value.name,
          itemID: value.itemID,
          sellingPrice: value.price,
          costPrice: value.price,
          checked: true,
          quantity: 1,
          discount: 0,
        });
      }
    },
    setChecked: (state, action) => {
      console.log(action.payload.checked)
      state.checked = action.payload
    },
    setDiscount: (state, action)=>{
      state.discount = action.payload
    },
    updateQuantity: (state, action) => {
      state.checked[action.payload.index].quantity = action.payload.quantity;
    },
    updateDiscount: (state, action) => {
      state.checked[action.payload.index].discount = action.payload.discount;
      state.checked[action.payload.index].sellingPrice = state.checked[action.payload.index].costPrice*((100-action.payload.discount)/100);
      const diff = state.checked.reduce((reduced, currentValue)=>{
        return reduced + (currentValue.costPrice-currentValue.sellingPrice)
      }, 0);
      const total = state.checked.reduce((reduced, currentValue)=>{
        return reduced + (currentValue.costPrice)
      }, 0)
      state.discount = (diff/total)*100
    },
    updateTotalDiscount: (state, action) => {
      state.discount = action.payload.discount
      state.checked.forEach((element)=>{
        element.discount = action.payload.discount
        element.sellingPrice = element.costPrice*((100-action.payload.discount)/100)
      })
    },
    setUser: (state, action) => {
      state.user.name = action.payload.name;
      state.user.userName = action.payload.username;
    },
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setOrderSubmitted: (state, action) => {
      state.orderSubmitted = action.payload;
    },

    setClientName: (state, action) => {
      state.client.name = action.payload;
    },
    setClientNumber: (state, action) => {
      state.client.number = action.payload;
    },
    setClientAddress: (state, action) => {
      state.client.address = action.payload;
    },
    setClientBusiness: (state, action) => {
      state.client.business = action.payload;
    },
    setClientReference: (state, action) => {
      state.client.reference = action.payload;
    },
  },
});

export const {
  refreshCheck,
  updateQuantity,
  updateDiscount,
  updateAllDiscount,
  updateTotalDiscount,
  updateChecked,
  setDiscount,
  setUser,
  setClient,
  setToken,
  setClientAddress,
  setClientBusiness,
  setClientName,
  setClientNumber,
  setClientReference,
  setChecked
} = checkedSlice.actions;
export default checkedSlice.reducer;
