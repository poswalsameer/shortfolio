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
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black 
    sm:h-screen sm:w-screen sm:flex sm:flex-col sm:justify-center sm:items-center sm:bg-[#FFF6F2] sm:text-black 
    md:h-screen md:w-screen md:flex md:flex-col md:justify-center md:items-center md:bg-[#FFF6F2] md:text-black   
    lg:h-screen lg:w-screen lg:flex lg:flex-col lg:justify-center lg:items-center lg:bg-[#FFF6F2] lg:text-black 
    xl:h-screen xl:w-screen xl:flex xl:flex-col xl:justify-center xl:items-center xl:bg-[#FFF6F2] xl:text-black 
    2xl:h-screen 2xl:w-screen 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:bg-[#FFF6F2] 2xl:text-black' id='homepageID'>

      {/* CENTER ME CONTENT */}
      <div className='h-[80%] w-[70%] flex flex-col gap-y-12 justify-center items-center
      sm:h-[80%] sm:w-[70%] sm:flex sm:flex-col sm:gap-y-12 sm:justify-center sm:items-center
      md:h-[80%] md:w-[70%] md:flex md:flex-col md:gap-y-12 md:justify-center md:items-center
      lg:h-[80%] lg:w-[70%] lg:flex lg:flex-col lg:gap-y-12 lg:justify-center lg:items-center
      xl:h-[80%] xl:w-[70%] xl:flex xl:flex-col xl:gap-y-12 xl:justify-center xl:items-center
      2xl:h-[80%] 2xl:w-[70%] 2xl:flex 2xl:flex-col 2xl:gap-y-12 2xl:justify-center 2xl:items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1
        sm:flex sm:flex-col sm:justify-center sm:items-center sm:gap-y-1
        md:flex md:flex-col md:justify-center md:items-center md:gap-y-1
        lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-1
        xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-1
        2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-1'>

          <h1 className='text-6xl font-bold
          sm:text-8xl sm:font-bold
          md:text-8xl md:font-bold
          lg:text-8xl lg:font-bold
          xl:text-8xl xl:font-bold 
          2xl:text-9xl 2xl:font-bold'>
            Shortfolio.
          </h1>

          <h1 className='text-sm text-gray-500
          sm:text-xl sm:text-gray-500
          md:text-xl md:text-gray-500
          lg:text-xl lg:text-gray-500
          xl:text-xl xl:text-gray-500
          2xl:text-2xl 2xl:text-gray-500 '>
            Show the world who you are
          </h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-y-4
        sm:flex sm:flex-col sm:justify-center sm:items-center sm:gap-y-4
        md:flex md:flex-col md:justify-center md:items-center md:gap-y-4
        lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-6
        xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-6
        2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-6'>

          <Link href="/signup">
            <Button variant="secondary" 
            className='h-9 w-44
            sm:h-9 sm:w-44
            md:h-9 md:w-44
            lg:h-9 lg:w-44
            xl:h-10 xl:w-48  
            2xl:h-10 2xl:w-48' >Create your shortfolio</Button>
          </Link>
          <Button variant="destructive" 
          className='h-8 w-16
          sm:h-8 sm:w-16
          md:h-8 md:w-16
          lg:h-8 lg:w-16
          xl:h-9 xl:w-20
          2xl:h-9 2xl:w-20' onClick={loginButtonClicked}>Login</Button>
        </div>
      </div>

      <div className='h-[20%] w-full
      sm:h-[20%] sm:w-full
      md:h-[20%] md:w-full
      lg:h-[20%] lg:w-full
      xl:h-[20%] xl:w-full
      2xl:h-[20%] 2xl:w-full' id='homepageImage'>
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

