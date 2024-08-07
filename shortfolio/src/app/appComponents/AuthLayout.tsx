import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserProfile from '../appComponents/UserProfile';
import LoginPage from '../appComponents/LoginPage';
import Homepage from './Homepage';

function AuthLayout(props:any) {

   let username = props.userProfile;

   if( username === '' ){
        username = null;
   }

  return (

        username ? <> <UserProfile params={username}/> </> : <> <LoginPage /> </>

  )
}

export default AuthLayout
