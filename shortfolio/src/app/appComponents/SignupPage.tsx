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
    <div className=" h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black">
      <div className="h-[80%] w-[70%] flex flex-col gap-y-10 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-y-1">
          <h1 className=" text-9xl font-bold">Shortfolio.</h1>
          {/* <h1 className='text-2xl text-gray-500 '>Login</h1> */}
        </div>

        <form onSubmit={handleSubmit(signupUserFunction)}>
          <div className="flex flex-col justify-center items-center gap-y-6">
            {/* EMAIL INPUT FIELD */}
            <Input
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
              type="text"
              placeholder="Full Name"
              {...register("fullName", {
                required: "Full Name is required",
              })}
            />

            <Button variant="destructive">Create account</Button>
          </div>
        </form>
      </div>

      <div className="h-[20%] w-full" id="loginImage">
        {/* yaha homepage wali image hai */}
      </div>
    </div>
  );
}

export default page;
