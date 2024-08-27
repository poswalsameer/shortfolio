"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/Link";
import { useForm } from "react-hook-form";
import authServiceObject from "../appwrite";
import databaseServiceObject from "../database.appwrite";
import { useDispatch } from "react-redux";
import { checkLogin } from "../features/auth.slice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const signupUserFunction = async (data: any) => {
    console.log("This is the data coming from all the signup fields: ", data);

    setError("");

    try {
      const signUpDetails = await authServiceObject.registerUser(data);
      if (!signUpDetails) {
        toast({
          title: "User already exists with this email",
        });
      }

      if (signUpDetails) {
        const userData = await authServiceObject.getLoggedInUser();

        // SETTING THE COOKIE AFTER USER LOGIN
        Cookies.set("userCookie", "12345678");
        const userCookieValue = Cookies.get("userCookie");
        if (userCookieValue) {
          console.log("The value of the cookie is: ", userCookieValue);
        } else {
          console.log("User cookie not found");
        }

        // const username = userData.name.split(" ").join('');

        if (userData) {
          dispatch(checkLogin(userData));
          console.log("the user data is: ", userData);
        }

        //NAVIGATING THE PAGE TO LOGIN PAGE AFTER SUCCESSFULL SIGNUP
        router.push("/enterDetails");
        // router.push(`/user/${username}`);
      }

      router.push("/enterDetails");
    } catch (error: any) {
      setError(error.message);
      console.log("This is the error message: ", error);
    }
  };

  useEffect(() => {
    if (errors.password?.message) {
      toast({
        title: errors.password?.message as string,
      });
    }

    if( errors.email?.message ){
      toast({
        title: errors.email?.message as string,
      });
    }

    if( errors.fullName?.message ){
      toast({
        title: errors.fullName?.message as string,
      });
    }
  }, [errors.password, errors.email, errors.fullName]);

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black
    sm:h-screen sm:w-screen sm:flex sm:flex-col sm:justify-center sm:items-center sm:bg-[#FFF6F2] sm:text-black
    md:h-screen md:w-screen md:flex md:flex-col md:justify-center md:items-center md:bg-[#FFF6F2] md:text-black
    lg:h-screen lg:w-screen lg:flex lg:flex-col lg:justify-center lg:items-center lg:bg-[#FFF6F2] lg:text-black
    xl:h-screen xl:w-screen xl:flex xl:flex-col xl:justify-center xl:items-center xl:bg-[#FFF6F2] xl:text-black 
    2xl:h-screen 2xl:w-screen 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:bg-[#FFF6F2] 2xl:text-black">

      <div className="h-[80%] w-[70%] flex flex-col gap-y-10 justify-center items-center
      sm:h-[80%] sm:w-[70%] sm:flex sm:flex-col sm:gap-y-10 sm:justify-center sm:items-center
      md:h-[80%] md:w-[70%] md:flex md:flex-col md:gap-y-10 md:justify-center md:items-center
      lg:h-[80%] lg:w-[70%] lg:flex lg:flex-col lg:gap-y-10 lg:justify-center lg:items-center
      xl:h-[80%] xl:w-[70%] xl:flex xl:flex-col xl:gap-y-10 xl:justify-center xl:items-center
      2xl:h-[80%] 2xl:w-[70%] 2xl:flex 2xl:flex-col 2xl:gap-y-10 2xl:justify-center 2xl:items-center">

        <div className="flex flex-col justify-center items-center gap-y-1
        sm:flex sm:flex-col sm:justify-center sm:items-center sm:gap-y-1
        md:flex md:flex-col md:justify-center md:items-center md:gap-y-1
        lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-1
        xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-1
        2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-1">

          <h1 className="text-6xl font-bold
          sm:text-8xl sm:font-bold
          md:text-9xl md:font-bold
          lg:text-9xl lg:font-bold
          xl:text-9xl xl:font-bold 
          2xl:text-9xl 2xl:font-bold">
            Shortfolio.
          </h1>

        </div>

        <form onSubmit={handleSubmit(signupUserFunction)}>

          <div className="flex flex-col justify-center items-center gap-y-4
          sm:flex sm:flex-col sm:justify-center sm:items-center sm:gap-y-5
          md:flex md:flex-col md:justify-center md:items-center md:gap-y-6
          lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-6
          xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-6
          2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-6">
            {/* EMAIL INPUT FIELD */}
            <Input
              className="h-10 w-44 sm:h-10 sm:w-72"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email address is required",
                validate: {
                  matchPattern: (value) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />

            {/* PASSWORD INPUT FIELD */}
            <Input
              className="h-10 w-44 sm:h-10 sm:w-72"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password should be minimum of 8 characters",
                },
              })}
            />

            {/* FULL NAME INPUT FIELD */}
            <Input
              className="h-10 w-44 sm:h-10 sm:w-72"
              type="text"
              placeholder="Full Name"
              {...register("fullName", {
                required: "Full Name is required",
              })}
            />

            <Button variant="destructive" className="h-9 w-32 text-xs 
            sm:h-10 sm:w-36 sm:text-sm
            md:h-10 md:w-36
            lg:h-10 lg:w-36
            xl:h-10 xl:w-36
            2xl:h-10 2xl:w-36">
              Create account
            </Button>
          </div>
        </form>
      </div>

      <div className="h-[20%] w-full
      sm:h-[20%] sm:w-full
      md:h-[20%] md:w-full
      lg:h-[20%] lg:w-full
      xl:h-[20%] xl:w-full
      2xl:h-[20%] 2xl:w-full" id="loginImage">
        {/* yaha homepage wali image hai */}
      </div>
    </div>
  );
}

export default page;
