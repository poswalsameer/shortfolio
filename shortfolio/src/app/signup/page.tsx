'use client'

import React from 'react'
import SignupPage from '../appComponents/SignupPage';
import { Provider } from 'react-redux';
import { store } from '../reduxStore/store';
import { useEffect, useState } from 'react';
import authServiceObject from '../appwrite';


function page() {

  const [user, setUser] = useState('');

  const findCurrentUser = async () => {

      setUser('');

      const currentUser = await authServiceObject.getLoggedInUser();

      if( currentUser ){
        const username = currentUser.name.split(" ").join('');
        setUser(username);
      }
      else{
        setUser('');
      }

  }

  useEffect( () => {

    // CALLING THE FUNCTION TO FIND THE CURRENT USER AS SOON AS THE PAGE LOADS
    findCurrentUser(); 

  }, [] )

  return (
    
    <Provider store={store}>
      
        <SignupPage />
      
    </Provider>
  )
}

export default page
