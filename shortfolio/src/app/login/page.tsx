'use client'

import React from 'react'
import LoginPage from '../appComponents/LoginPage';
import { Provider } from 'react-redux'
import { store } from '../reduxStore/store';

function page() {
  return (
    <Provider store={store}>
    < LoginPage />
    </Provider>
  )
}

export default page
