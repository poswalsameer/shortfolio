'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import UserProfile from '../../appComponents/UserProfile';
import { store } from '../../reduxStore/store';
import authServiceObject from '../../appwrite';
import ImageContextProvider from '@/app/contexts/ImageContextProvider';
import databaseServiceObject from '@/app/database.appwrite';
import { GetServerSideProps } from 'next';

//interface for serverProps
interface serverProps{
  userDetailsServer: any,
  userImageServer: string,
  userEmailServer: string,
  loadingServer: boolean,
  loginStatusServer: boolean
}

function Page( {userDetailsServer, userImageServer, userEmailServer, loadingServer, loginStatusServer} : serverProps) {

    const [ userName, setUserName ] = useState('');

  return (

    <Provider store={store}>

        <ImageContextProvider>
          <UserProfile 
          userDetailsServer={userDetailsServer}
          userImageServer={userImageServer}
          userEmailServer={userEmailServer}
          loadingServer={loadingServer}
          loginStatusServer={loginStatusServer} />
        </ImageContextProvider>

    </Provider>
   
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  let userDetails = {};
  let userImage = "";
  let userEmailVar = "";
  let loading = false;
  let loginStatus = false;

  // FUNCTION TO CONVERT EMAIL TO STRING
  const convertEmailToString = (data: any) => {
    let n = data.length;
    let convertedString = "";

    for (let i = 0; i < n; i++) {
      if (data[i] === "@" || data[i] === ".") {
        convertedString = convertedString + "0";
      } else {
        convertedString = convertedString + data[i];
      }
    }

    return convertedString;
  };

  // FUNCTION TO GET FILE ID
  const getFileID = async (fileId: string) => {
    try {
      const file = await databaseServiceObject.getFilePreview(fileId);

      if (file) {
        console.log("Got the file from the backend");
        return file;
      } else {
        console.log("Didn't got the file from the backend");
        return undefined;
      }
    } catch (error) {
      console.log(
        "Error from the frontend side while getting the file: ",
        error
      );
    }
  };

  try {
    const currentUser = await authServiceObject.getLoggedInUser();

    if (currentUser) {

      console.log("inside the if statement of currentuser");
      
      loginStatus = true; // setLoginStatus(true);
      console.log(currentUser);
      
      // Converting the email to normal string
      const convertedEmail = convertEmailToString(currentUser.email);

      //setting the email in the state
      userEmailVar = currentUser.email // setUserEmail(currentUser.email);

      //find document with string mail id
      const userEmail = await databaseServiceObject.getUser(convertedEmail);

      if( userEmail.profilePhoto ){
        const photoFile = await getFileID(userEmail.profilePhoto);

        if (photoFile) {
          userImage = photoFile // setUserImage(photoFile);
        }
        else{
        }
      }
      else{
        userImage = "/userProfile.png"; // setUserImage('/userProfile.png');
      }

      if (userEmail) {
        userDetails = userEmail; // setUserDetails(userEmail);
      } else {
        userDetails = {}; // setUserDetails({});
      }
    } else {
      loginStatus = false; // setLoginStatus(false);
    }
  } 
  catch (error) {
    console.log("Error finding the details of the user: ", error);
  }

  console.log(userDetails);
  

  return {
    props: {
      userDetails, 
      userImage, 
      userEmailVar,
      loading,
      loginStatus
    }
  }

}

export default Page
