import {fetchBaseQuery,createApi} from '@reduxjs/toolkit/query/react';
  
import { BASE_URL } from './Features/constants';    
const baseQuery =fetchBaseQuery( {baseUrl :BASE_URL })
export const UserApiSlice =createApi({
    baseQuery,
    tagTypes:['product','Order','User','Catagory'],
    endpoints:()=>({})
})