import React, { useState, useEffect } from 'react'
import { checkLogin, checkLogout } from "../features/auth.slice";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import authServiceObject from '../appwrite';
import { useRouter } from 'next/navigation';
import databaseServiceObject from '../database.appwrite';
import Cookies from 'js-cookie';



function Homepage() {

  const router = useRouter();
  const dispatch = useDispatch();
  

  // FUNCTION TO CONVERT EMAIL TO NORMAL STRING
  const convertEmailToString = (data: any) => {

      let n = data.length;
      let convertedString = "";

      for(let i=0; i<n; i++){

          if( data[i] === '@' || data[i] === '.' ){
            convertedString = convertedString + '0';
          }
          else{
            convertedString = convertedString + data[i];
          }

      }

      return convertedString;

  }

  const loginButtonClicked = async () => {

    // GETTING ANY ACTIVE SESSION IF ANY
    const currentSession = await authServiceObject.getCurrentSession();

    if( currentSession ){
        
        const currentUser = await authServiceObject.getLoggedInUser();

        Cookies.set( 'userCookie', '12345678' );
        const userCookieValue = Cookies.get('userCookie');
        if( userCookieValue ){
            console.log( "The value of the cookie is: " ,userCookieValue);
        }
        else{
          console.log("User cookie not found");
          
        }

        if( currentUser ){
          
          console.log("The current session details are: ", currentUser);
          
          const convertedEmail = convertEmailToString(currentUser.email);
          console.log("Email after conversion: ", convertedEmail);

          const userInDB = await databaseServiceObject.getUser(convertedEmail);

          if( userInDB ){
            console.log( "User found in DB: ", userInDB );

            const username = userInDB.username;
            console.log("The username is: ", username);
            
            dispatch(checkLogin(currentUser));

            console.log("Redirecting to:", `/user/${username}`);
            router.push(`/user/${username}`)
            console.log("User pushed to the route");
            
          }
          else{
            console.log("User not found in DB");
          }
    
        }
    }
    else{
      // IF SESSION NOT FOUND, THEN REDIRECT TO LOGIN PAGE
      router.push('/login');
    }

  }
    

  return (
    <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black' id='homepageID'>

      {/* CENTER ME CONTENT */}
      <div className='h-[80%] w-[70%] flex flex-col gap-y-12 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
          <h1 className='text-2xl text-gray-500 '>Show the world who you are</h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-y-6'>
          <Link href="/signup">
            <Button variant="secondary" >Create your shortfolio</Button>
          </Link>
          {/* <Link href="/login"> */}
            <Button variant="destructive" className='h-9 ' onClick={loginButtonClicked}>Login</Button>
          {/* </Link> */}
        </div>
      </div>

      <div className='h-[20%] w-full' id='homepageImage'>
        {/* yaha homepage wali image hai */}
      </div>

     

    </div>
  )
}

export default Homepage
function dispatch(arg0: {
  payload: any; type: "authCheck/checkLogin"; // IF CURRENT SESSION EXISTS, THEN FIND THE USER DETAILS
}) {
  throw new Error('Function not implemented.');
}

