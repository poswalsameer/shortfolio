"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { PenLine } from "lucide-react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import authServiceObject from "../appwrite";
import { useRouter } from "next/navigation";
import { checkLogout } from "../features/auth.slice";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";
import databaseServiceObject from "../database.appwrite";
import { FaBehance, FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaReddit } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";

function page({ params }: { params: any }) {
  const [error, setError] = useState("");

  const [userDetails, setUserDetails] = useState<any>({});
  const [userImage, setUserImage] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const dispatch = useDispatch();
  const router = useRouter();

  const logoutButtonClicked = async () => {
    setError("");

    try {
      await authServiceObject.logoutUser();
      dispatch(checkLogout());

      Cookie.remove("userCookie");

      // DELETING COOKIE AFTER LOGGING OUT THE USER
      const cookieAfterDeletion = Cookie.get("userCookie");
      console.log("value of cookie after deleting is: ", cookieAfterDeletion);
      // AFTER LOGGING OUT, THE COOKIE BECOMES UNDEFINED

      router.push("/login");
    } catch (error: any) {
      setError(error.message);
    }
  };

  // FUNCTION TO CONVERT EMAIL TO NORMAL STRING
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

  const getCurrentUserDetails = async () => {
    try {
      const currentUser = await authServiceObject.getLoggedInUser();

      if (currentUser) {
        console.log("Details of the current user: ", currentUser);

        // Converting the email to normal string
        const convertedEmail = convertEmailToString(currentUser.email);
        console.log("Converted mail: ", convertedEmail);

        //setting the email in the state
        setUserEmail(currentUser.email);

        //find document with string mail id
        const userEmail = await databaseServiceObject.getUser(convertedEmail);
        const photoFile = await getFileID(userEmail.profilePhoto);

        if (photoFile) {
          setUserImage(photoFile);
        }
        console.log("The file we got is: ", photoFile);

        if (userEmail) {
          console.log("Details of the document with this id: ", userEmail);
          setUserDetails(userEmail);
          // setUserDetails({...userEmail, photoFile})
        } else {
          setUserDetails({});
          console.log("Document not found with this id");
        }
      } else {
        console.log("User details not found");
      }
    } catch (error) {
      console.log("Error finding the details of the user: ", error);
    }
  };

  useEffect(() => {
    getCurrentUserDetails();
  }, []);

  return (
    // <div>
    //   {params.userProfile}
    // </div>

    <div
      className=" h-screen w-screen flex flex-row justify-center items-center gap-x-10 text-black"
      id="bodyDiv"
    >
      {/* LEFT SIDE WALA DIV */}
      <div
        className="h-[92%] w-[40%] flex flex-col rounded-r-3xl "
        id="leftDiv"
      >
        {/* profile photo + name + bio wala div */}
        <div className="h-[65%] w-full  flex flex-col justify-center items-center gap-y-4 rounded-tr-3xl">
          {/* IMAGE */}
          <div className=" h-60 w-60 rounded-full ">
            <img
              src={userImage}
              alt=""
              className="h-full w-full rounded-full"
            />
          </div>

          {/* NAME */}
          <div className=" w-[80%] text-4xl font-bold flex justify-center items-center">
            {userDetails.fullName}
          </div>

          {/* BIO */}
          <div className="w-[80%] text-xl text-center text-gray-700 font-base flex justify-center items-center">
            {userDetails.bio}
          </div>
        </div>

        {/* extra link wala div */}
        <div className="h-[15%] w-full font-semibold flex flex-col text-black justify-center items-center gap-y-3">
        </div>

        {/* button wala div */}

        <div className=" h-[20%] w-full  flex flex-col justify-center items-center">

          <div className="h-[25%] w-full font-semibold text-black flex justify-center items-center">
              {userEmail}
          </div>

          <div className="h-[75%] w-full flex flex-row justify-center items-center gap-x-10 rounded-br-3xl">
            {/* COPY BUTTON */}
            <Button
              variant="secondary"
              className=" h-9 w-24 text-xs font-semibold flex flex-row justify-center items-center gap-x-2 transition-all delay-75 ease-in bg-black hover:bg-gray-700"
            >
              Copy
              <Link2 className="h-4 w-4" />
            </Button>

            {/* EDIT BUTTON */}
            <Link href="/enterDetails">
              <Button
                variant="destructive"
                className="h-9 w-24 text-xs font-semibold flex flex-row justify-center items-center gap-x-2 transition-all delay-75 ease-in bg-gray-700 hover:bg-gray-800"
              >
                Edit
                <PenLine className="h-4 w-4" />
              </Button>
            </Link>

            <Button
              variant="secondary"
              className="h-9 w-24 text-xs  font-semibold flex flex-row justify-center items-center gap-x-2 transition-all delay-75 ease-in bg-blue-900 hover:bg-blue-950"
              onClick={logoutButtonClicked}
            >
              Logout
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE WALA DIV */}
      <div
        className="h-[92%] w-[65%] mr-5 rounded-l-3xl flex flex-col justify-center items-center gap-y-4 text-white"
        id="rightDiv"
      >
        {/* twitter github wala div */}
        <div className="h-[21.5%] w-[95%] flex justify-center items-center gap-x-5 ">
          {/* twitter wala div */}
          <div className="h-full w-[50%] flex justify-center items-center rounded-xl bg-black">
            <div className="h-full w-[40%] flex justify-center items-center">
              <FaSquareXTwitter className="h-16 w-16" />
            </div>

            <div className="h-full w-[60%] text-2xl font-semibold flex flex-col justify-center items-start">
              <div>
                <Link
                  href={`https://x.com/${userDetails.twitterURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{userDetails.twitterURL}
                </Link>
              </div>

              <div className="text-sm font-base text-gray-400">X.com</div>
            </div>
          </div>

          {/* github wala div */}
          <div className="h-full w-[50%] flex justify-center items-center rounded-xl bg-[#25292F]">
            <div className="h-full w-[40%] flex justify-center items-center">
              <FaGithub className="h-16 w-16" />
            </div>

            <div className="h-full w-[60%] text-2xl font-semibold flex flex-col justify-center items-start">
              <div>
                <Link
                  href={`https://github.com/${userDetails.githubURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{userDetails.githubURL}
                </Link>
              </div>

              <div className="text-sm font-base text-gray-400">Github.com</div>
            </div>
          </div>
        </div>

        {/* linkedin wala div */}
        <div className="h-[21.5%] w-[95%] flex justify-center items-center bg-[#086BC9] rounded-xl">
          <div className="h-full w-[40%] flex justify-center items-center">
            <FaLinkedin className="h-16 w-16" />
          </div>

          <div className="h-full w-[60%] text-2xl font-semibold flex flex-col justify-center items-start">
            <div>
              <Link
                href={`https://linkedin.com/in/${userDetails.linkedinURL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{userDetails.linkedinURL}
              </Link>
            </div>

            <div className="text-sm font-base text-blue-200">LinkedIn.com</div>
          </div>
        </div>

        {/* behance instagram wala div */}
        <div className="h-[21.5%] w-[95%] flex justify-center items-center gap-x-5 rounded-xl">
          {/* behance wala div */}
          <div className="h-full w-[40%] flex justify-center items-center rounded-xl bg-[#0057FF]">
            <div className="h-full w-[40%] flex justify-center items-center">
              <FaBehance className="h-16 w-16" />
            </div>

            <div className="h-full w-[60%] text-2xl font-semibold flex flex-col justify-center items-start">
              <div>
                <Link
                  href={`https://behance.com/${userDetails.behanceURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{userDetails.behanceURL}
                </Link>
              </div>

              <div className="text-sm font-base text-blue-200">Behance.com</div>
            </div>
          </div>

          {/* instagram wala div */}
          <div className="h-full w-[67%] flex justify-center items-center rounded-xl bg-[#FF7D43]">
            <div className="h-full w-[40%] flex justify-center items-center">
              <FaInstagram className="h-16 w-16" />
            </div>

            <div className="h-full w-[60%] text-2xl font-semibold flex flex-col justify-center items-start">
              <div>
                <Link
                  href={`https://instagram.com/${userDetails.instagramURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{userDetails.instagramURL}
                </Link>
              </div>

              <div className="text-sm font-base text-yellow-100">
                Instagram.com
              </div>
            </div>
          </div>
        </div>

        {/* textarea wala div */}
        <div className="h-[21.5%] w-[95%] flex justify-center items-center bg-black rounded-xl">
          {userDetails.TextArea}
        </div>
      </div>
    </div>
  );
}

export default page;
