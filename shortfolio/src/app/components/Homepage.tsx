import React from 'react'
import { checkLogin, checkLogout } from "../features/auth.slice";
import { useDispatch, useSelector } from 'react-redux';

function Homepage() {

    const dispatch = useDispatch();
    const status = useSelector((state:any) => state.authCheck.value);

    const loginClicked = () => {
        dispatch(checkLogin({}));

    }

    const logoutClicked = () => {
        dispatch(checkLogout());
    }

  return (
    <div className=' h-full w-full flex flex-col justify-center items-center bg-black text-white'>
      
      Test
      <button className=' h-32 w-64 bg-white text-black text-center my-20' onClick={loginClicked}> Login </button>
      {status}
      <button className=' h-32 w-64 bg-white text-black text-center my-20' onClick={logoutClicked}> Logout </button>
    </div>
  )
}

export default Homepage
