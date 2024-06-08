import{ createSlice } from '@reduxjs/toolkit'

const initialState ={
    userInfo:localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem("userinfo"))
    : null,
}
  
  const authSlice = createSlice ( {
	name:"auth",
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.userinfo= action.playload;
            localStorage.setItem("userinfo",JSON.stringify(action.playload))
            const expirationTime = new Date().getTime()+30*24*60*60*1000;
            localStorage.setItem("expirationTime",expirationTime)
           },

           logout: (state)=>{
            state.userinfo =null;
            localStorage.clear();

           }
    
        },
  });
  
  export const {
    setCredientials, logout} =authSlice.actions;
    export default authSlice.reducer;

  
  

  