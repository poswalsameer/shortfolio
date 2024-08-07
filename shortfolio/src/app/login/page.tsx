'use client'

import React, { useEffect, useState } from 'react'
import LoginPage from '../appComponents/LoginPage';
import { Provider } from 'react-redux'
import { store } from '../reduxStore/store';
import authServiceObject from '../appwrite';
import AuthLayout from '../appComponents/AuthLayout';

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
      <AuthLayout userProfile={user}>
          < LoginPage />
      </AuthLayout>
    </Provider>
  )
}

export default page
