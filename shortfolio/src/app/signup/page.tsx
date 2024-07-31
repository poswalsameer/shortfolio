'use client'

import React from 'react'
import SignupPage from '../appComponents/SignupPage';
import { Provider } from 'react-redux';
import { store } from '../reduxStore/store';


function page() {
  return (
    
    <Provider store={store}>
    <SignupPage />
    </Provider>
  )
}

export default page
