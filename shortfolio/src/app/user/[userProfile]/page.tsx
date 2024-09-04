'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import UserProfile from '../../appComponents/UserProfile';
import { store } from '../../reduxStore/store';
import authServiceObject from '../../appwrite';
import ImageContextProvider from '@/app/contexts/ImageContextProvider';


function Page() {

    const [ userName, setUserName ] = useState('');

    // const getCurrentUserDetails = async () => {

    //     setUserName('');

    //     const currentUser = await authServiceObject.getLoggedInUser();
    //     // console.log("Details of the current user: ", currentUser);
        

    //     if( currentUser ){
    //         // console.log(currentUser.name);
    //         setUserName(currentUser.name);
    //     }
    //     else{
    //         console.log("Current user not found");
            
    //     }
    // }

    // useEffect( () => {
    //     getCurrentUserDetails();
    // }, [] );

  return (

    <Provider store={store}>

        {/* WRAPPING THE WHOLE USERPROFILE COMPONENT WITH THE IMAGE CONTEXT PROVIDER */}
        <ImageContextProvider>
          <UserProfile params={userName} />
        </ImageContextProvider>

    </Provider>
   
  )
}

export default Page
