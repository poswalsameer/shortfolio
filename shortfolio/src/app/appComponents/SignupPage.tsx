'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/Link";
import { useForm } from 'react-hook-form'
import authServiceObject from '../appwrite';
import databaseServiceObject from '../database.appwrite';
import { useDispatch } from 'react-redux';
import { checkLogin } from '../features/auth.slice';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// import Router from 'next/router';

function page() {

  const {register, handleSubmit} = useForm();
  const[error, setError] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();

  const signupUserFunction = async(data:any) => {

    console.log( "This is the data coming from all the signup fields: " ,data);

    // UPLOADING THE PHOTO TO THE BACKEND
    // try {
    //   const uploadedImage = await databaseServiceObject.fileUpload(data.profilePhoto[0]);

    //   if( uploadedImage ){
    //     console.log( "image uploaded successfully" );
    //   }
    //   else{
    //     console.log(uploadedImage);
        
    //     console.log("cannot upload the image");
    //   }
    // } catch (error) {
    //   console.log("error in the catch part:", error);
    // }

    // CREATING A NEW DOCUMENT AFTER THE USER CLICKS SIGNUP BUTTON
    // const createdDocument = await databaseServiceObject.userDetails({ usernameFrontend: data.username, bioFrontend: '', twitterFrontend: '', githubFrontend: '', instagramFrontend: '', behanceFrontend:  '', linkedinFrontend: '', textFrontend: '', profilePhotoFrontend: data.profilePic[0], fullNameFrontend: data.fullName, passwordFrontend: data.password, emailFrontend: data.email });
    
    // console.log("created document:", createdDocument);
    

    // if( createdDocument ){
    //   console.log("Document created successfully: ", createdDocument);
    // }
    // else{
    //   console.log("Cannot create the document after registration.");
    // }

    

    setError('');

    try {
      
      const signUpDetails = await authServiceObject.registerUser(data);

      if( signUpDetails ){
        const userData = await authServiceObject.getLoggedInUser();

        // SETTING THE COOKIE AFTER USER LOGIN
        Cookies.set( 'userCookie', '12345678' );
        const userCookieValue = Cookies.get('userCookie');
        if( userCookieValue ){
            console.log( "The value of the cookie is: " ,userCookieValue);
        }
        else{
          console.log("User cookie not found");
          
        }

        const username = userData.name.split(" ").join('');

        if( userData ){
          dispatch(checkLogin(userData));
        }

        //NAVIGATING THE PAGE TO LOGIN PAGE AFTER SUCCESSFULL SIGNUP
        router.push('/enterDetails');
        // router.push(`/user/${username}`);

      }

    } catch (error:any) {
        setError(error.message);
    }
    
  }

  return (
    <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black'>

        <div className='h-[80%] w-[70%] flex flex-col gap-y-10 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
          {/* <h1 className='text-2xl text-gray-500 '>Login</h1> */}
        </div>

        <form onSubmit={handleSubmit(signupUserFunction)}>
          <div className='flex flex-col justify-center items-center gap-y-6'>

              {/* EMAIL INPUT FIELD */}
              <Input type="email" placeholder="Email" 
              {...register("email", {
                required:true,
                validate: {
                    matchPattern: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Email address must be a valid address",
                }
              })}
              />

              {/* PASSWORD INPUT FIELD */}
              <Input type="password" placeholder="Password" 
              {...register("password", {
                required: true,
                minLength: 8,
              })}
              />

              {/* FULL NAME INPUT FIELD */}
              <Input type="text" placeholder="Full Name" 
              { ...register("fullName", {
                required: true,
              }) }
              />

              {/* USERNAME INPUT FIELD */}
              {/* <Input type="text" placeholder="Username" 
              {...register("username", {
                required:true,
              })}
              /> */}

              {/* PROFILE PHOTO FIELD */}
              {/* <Input type="file" id='profilePic' 
                {...register( "profilePhoto", {
                  required: true
                } )}
              /> */}

              <Button variant="destructive">Create account</Button>
            
          </div>
        </form>

        </div>

        <div className='h-[20%] w-full' id='loginImage'>
        {/* yaha homepage wali image hai */}
      </div>
      
    </div>
  )
}

export default page
