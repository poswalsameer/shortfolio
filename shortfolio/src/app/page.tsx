'use client'

import Image from "next/image";
import { store } from "./reduxStore/store";
import { Provider } from "react-redux";
import Homepage from "./appComponents/Homepage";
import { useState, useEffect } from "react"; 
import authServiceObject from "./appwrite";

export default function Home() {

  const [user, setUser] = useState('');

  const findCurrentUser = async () => {

      setUser('');

      const currentUser = await authServiceObject.getLoggedInUser();

      if( currentUser ){
        const username = currentUser.name.split(" ").join('');
        console.log("The username is:", username);
        
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
    <Provider store={store} >
        < Homepage />
    </Provider>
  );
}
