'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import UserProfile from '../../appComponents/UserProfile';
import { store } from '../../reduxStore/store';
import authServiceObject from '../../appwrite';
import ImageContextProvider from '@/app/contexts/ImageContextProvider';


function Page() {

    const [ userName, setUserName ] = useState('');

  return (

    <Provider store={store}>

        <ImageContextProvider>
          <UserProfile params={userName} />
        </ImageContextProvider>

    </Provider>
   
  )
}

export default Page
