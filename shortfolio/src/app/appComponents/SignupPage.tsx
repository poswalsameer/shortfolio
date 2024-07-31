'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/Link";
import { useForm } from 'react-hook-form'
import authServiceObject from '../appwrite';
import { useDispatch } from 'react-redux';
import { checkLogin } from '../features/auth.slice';

function page() {

  const {register, handleSubmit} = useForm();
  const[error, setError] = useState('');

  const dispatch = useDispatch();

  const signupUserFunction = async(data:any) => {

    console.log( "This is the data coming from all the signup fields: " ,data);

    setError('');

    try {
      
      const signUpDetails = await authServiceObject.registerUser(data);

      if( signUpDetails ){
        const userData = await authServiceObject.getLoggedInUser();

        if( userData ){
          dispatch(checkLogin(userData));
        }
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
              <Input type="text" placeholder="Username" 
              {...register("username", {
                required:true,
              })}
              />

              <Button variant="destructive" onClick={signupUserFunction}>Create account</Button>
            
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
