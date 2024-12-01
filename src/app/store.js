import {configureStore} from '@reduxjs/toolkit';
import checkedReducer from '../app/features/checked/checkedSlice'
export const store = configureStore({
    reducer: checkedReducer
});