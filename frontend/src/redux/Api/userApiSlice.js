import {apiSlice} from './apiSlice';
import { USERS_URL } from './Features/constants';


export const userApiSlice =apiSlice.injectEndpoints({
	endpoints:(builder)=>({
		login:builedr.mutation({
			query:(data)=>({
				url:`${USERS_URL}/auth`,
				method:"POST",
				body: data,
			}),
		}),
	}),
});

export const{ useLoginMutation }= userApiSlice;
