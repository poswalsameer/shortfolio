'use client'

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form";
import { checkLogin } from '../features/auth.slice';
import { Provider, useDispatch } from 'react-redux';
import authServiceObject from '../appwrite';
import { useRouter } from 'next/navigation';


function page() {

  const { register, handleSubmit } = useForm();

  const [error, setError] = useState('');
  const [user, setUser] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();

  const loginUserFunction = async(data:any) => {

    console.log(" This is the data coming from the input field: ",data);

    setError('');

    try {

      const loginSesson = await authServiceObject.loginUser(data);

      if( loginSesson ){
        setUser('');

        const userData = await authServiceObject.getLoggedInUser();
        console.log(userData);
        setUser(userData);
        // const user = userData.name;

        //CREATING USERNAME WITHOUT SPACES FOR URL
        const username = userData.name.split(" ").join('');
         
        if( userData ){
          dispatch(checkLogin(userData));
        }
      
        // NAVIGATING TO THE USER ROUTE AFTER SUCCESSFULL LOGIN
        router.push(`/user/${username}`);
        console.log("Redirected to the profile route");
        
        
      }
      
    } catch (error:any) {
      setError(error.message);
    }


  }

  return (
    
    <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black'>

        <div className='h-[80%] w-[70%] flex flex-col gap-y-20 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
          {/* <h1 className='text-2xl text-gray-500 '>Login</h1> */}
        </div>

        <form onSubmit={handleSubmit(loginUserFunction)}>
            <div className='flex flex-col justify-center items-center gap-y-8'>

                {/* EMAIL INPUT FIELD */}
                <Input type="email" placeholder="Email" 
                {...register("email", {
                    required: true,
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
                <Button type='submit' variant="secondary" className='h-9'>Login</Button>
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
