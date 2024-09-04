'use client'

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form";
import { checkLogin } from '../features/auth.slice';
import { Provider, useDispatch } from 'react-redux';
import authServiceObject from '../appwrite';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useToast } from "@/components/ui/use-toast";
import Loading from './Loading';


function Page() {

  const { register, handleSubmit,formState: { errors } } = useForm();

  const [error, setError] = useState('');
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const {toast} = useToast();

  const loginUserFunction = async(data:any) => {

    setLoading(true);
    console.log(" This is the data coming from the input field: ",data);

    localStorage.clear();

    setError('');

    try {

      const loginSession = await authServiceObject.loginUser(data);

      if( !loginSession ){
        toast({
          title: "Incorrect credentials",
        });
      }

      if( loginSession ){
        setUser('');

        const userData = await authServiceObject.getLoggedInUser();
        console.log(userData);

        // SETTING THE COOKIE AFTER USER LOGIN
        Cookies.set( 'userCookie', '12345678' );
        const userCookieValue = Cookies.get('userCookie');
        if( userCookieValue ){
            console.log( "The value of the cookie is: " ,userCookieValue);
        }
        else{
          console.log("User cookie not found");
          
        }
        
        
        setUser(userData);

        //CREATING USERNAME WITHOUT SPACES FOR URL
        const username = userData.name.split(" ").join('');
         
        if( userData ){
          dispatch(checkLogin(userData));
        }
      
        // NAVIGATING TO THE USER ROUTE AFTER SUCCESSFULL LOGIN
        setLoading(false);
        router.push(`/user/${username}`);
        console.log("Redirected to the profile route");
        
        
      }
      
    } catch (error:any) {
      setLoading(false);
      setError(error.message);
    }


  }

  useEffect(() => {
    if (errors.password?.message) {
      toast({
        title: errors.password?.message as string,
      });
    }
  }, [errors.password]);

  return (
    

    <>
    
      {
        loading ? (

          <>
            <Loading text="Logging into your profile"/>
          </>

        ) : (

          <>
            <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black'>

              <div className='h-[80%] w-[70%] flex flex-col gap-y-20 justify-center items-center'>

              <div className='flex flex-col justify-center items-center gap-y-1'>
                <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
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
                          minLength: {
                            value: 8,
                            message: "Password should be minimum of 8 characters",
                          },
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
          </>

        )
      }
    
    </>

  )
}

export default Page
