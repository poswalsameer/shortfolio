'use client'

import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import UserProfile from '../../appComponents/UserProfile';
import { store } from '../../reduxStore/store';
import authServiceObject from '../../appwrite';

function page() {

    const [ userName, setUserName ] = useState('');

    const getCurrentUserDetails = async () => {

        setUserName('');

        const currentUser = await authServiceObject.getLoggedInUser();
        console.log("Details of the current user: ", currentUser);
        

        if( currentUser ){
            console.log(currentUser.name);
            setUserName(currentUser.name);
        }
        else{
            console.log("Current user not found");
            
        }
    }

    useEffect( () => {
        getCurrentUserDetails();
    }, [] );
    

  return (
    <Provider store={store}>

        <UserProfile params={userName}/>

    </Provider>
  )
}

export default page
