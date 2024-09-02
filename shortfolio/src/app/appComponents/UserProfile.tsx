"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import Cropper from "react-easy-crop";
import getCroppedImg from "../features/getCroppedImg";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import EditBox from "./EditBox";
import ImageContextProvider from "../contexts/ImageContextProvider";
import ImageContext from "../contexts/ImageContext";
import Loading from "./Loading";

function page({params}: any) {
  const [error, setError] = useState("");

  const [userDetails, setUserDetails] = useState<any>({});
  const [userImage, setUserImage] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // TODO: Middleware shayad hatana padega, kyuki uski wjh se, home route par nahi jayega if logged in hai
  const [loginStatus, setLoginStatus] = useState<boolean>(false);

  const behanceGrid = false;

  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const logoutButtonClicked = async () => {

    setLoading(true);
    setError("");

    try {
      await authServiceObject.logoutUser();
      dispatch(checkLogout());

      Cookie.remove("userCookie");

      // DELETING COOKIE AFTER LOGGING OUT THE USER
      const cookieAfterDeletion = Cookie.get("userCookie");
      console.log("value of cookie after deleting is: ", cookieAfterDeletion);
      // AFTER LOGGING OUT, THE COOKIE BECOMES UNDEFINED

      router.push("/");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  };

  // FUNCTION TO COPY THE CURRENT URL
  const copyURL = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);

    toast({
      title: "URL copied to your clipboard",
    });
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

        setLoginStatus(true);
        console.log("Details of the current user: ", currentUser);

        // Converting the email to normal string
        const convertedEmail = convertEmailToString(currentUser.email);
        console.log("Converted mail: ", convertedEmail);

        //setting the email in the state
        setUserEmail(currentUser.email);

        //find document with string mail id
        const userEmail = await databaseServiceObject.getUser(convertedEmail);
        console.log("The userEmail data is: ", userEmail);
        

        if( userEmail.profilePhoto ){
          const photoFile = await getFileID(userEmail.profilePhoto);

          if (photoFile) {
            setUserImage(photoFile);
            console.log("This is the photo we got after getting the user: ", photoFile);
          }
          else{
            console.log("The file cannot be found because it was not uploaded");
          }
        }
        else{
          setUserImage('/userProfile.png');
        }

        if (userEmail) {
          console.log("Details of the document with this id: ", userEmail);
          setUserDetails(userEmail);
        } else {
          setUserDetails({});
          console.log("Document not found with this id");
        }
      } else {
        setLoginStatus(false);
        console.log("User details not found");
      }
    } catch (error) {
      console.log("Error finding the details of the user: ", error);
    }
  };

  // implementing image edit part here

  const [editMode, setEditMode] = useState(false);

  const closeEditBox = () => {
    setEditMode(false);
  };

  const openEditBox = () => {
    setEditMode(true);
  };

  // GETTING THE CONTEXT FROM THE IMAGECONTEXT CREATED
  const context = useContext(ImageContext);

  // IF CONTEXT NOT FOUND, THEN THROW A ERROR
  if (!context) {
    throw new Error("ProfileComponent must be used within an ImageContextProvider");
  }
  
  // GETTING THE STATE AND THE FUNCTION FROM THE CONTEXT
  const { profileImage, setProfileImage } = context;
  console.log("The profileImage coming is: ", profileImage);


  // THIS USE-EFFECT SAVES THE CROPPED IMAGE TO THE LOCAL STORAGE AFTER CONVERTING IT TO BASE64
  useEffect(() => {
    if (profileImage) {
      try {
        // Convert the image to base64 before saving
        const base64Image = profileImage.split(",")[1];
        localStorage.setItem("profilePhoto", base64Image);
        console.log("Profile image saved to local storage.");
      } catch (error) {
        console.error("Error saving the profile image: ", error);
      }
    }
  }, [profileImage]);


  // THIS USE EFFECT RETRIEVES THE STORED IMAGE FROM LOCAL STORAGE AND ALSO GETS THE CURRENT USER DETAILS
  useEffect(() => {
    try {
      const storedImage = localStorage.getItem("profilePhoto");
      console.log("Retrieved image from local storage: ", storedImage);
      if (storedImage) {
        const imageUrl = `data:image/png;base64,${storedImage}`;
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error("Error retrieving the profile image: ", error);
    }
    getCurrentUserDetails();
  }, []);
  

  return (

    <>
    
      {
        loading ? (

          <> 
            <Loading text="Logging you out"/>
          </>

        ) : (

          <> 
            <div
                  className=" 
                  md:h-screen md:w-screen md:flex md:flex-row md:justify-center md:items-center md:gap-x-10 md:text-black
                  lg:h-screen lg:w-screen lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-x-10 lg:text-black
                  xl:h-screen xl:w-screen xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-10 xl:text-black
                  2xl:h-screen 2xl:w-screen 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-10 2xl:text-black"
                  id="bodyDiv"
                >
                  {/* LEFT SIDE WALA DIV */}
                  <div
                    className="
                    md:h-[92%] md:w-[40%] md:flex md:flex-col md:rounded-r-3xl
                    lg:h-[92%] lg:w-[40%] lg:flex lg:flex-col lg:rounded-r-3xl
                    xl:h-[92%] xl:w-[40%] xl:flex xl:flex-col xl:rounded-r-3xl
                    2xl:h-[92%] 2xl:w-[40%] 2xl:flex 2xl:flex-col 2xl:rounded-r-3xl "
                    id="leftDiv"
                  >
                    {/* profile photo + name + bio wala div */}
                    <div className="
                    md:h-[70%] md:w-full md:flex md:flex-col md:justify-center md:items-center md:gap-y-16 md:rounded-tr-3xl
                    lg:h-[70%] lg:w-full lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-16 lg:rounded-tr-3xl
                    xl:h-[70%] xl:w-full xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-16 xl:rounded-tr-3xl
                    2xl:h-[70%] 2xl:w-full 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-16 2xl:rounded-tr-3xl">
                      {/* IMAGE */}

                      {!editMode ? (
                        <>
                          <div className=" 
                          md:relative md:h-52 md:w-52
                          lg:relative lg:h-52 lg:w-52
                          xl:relative xl:h-60 xl:w-60
                          2xl:relative 2xl:h-60 2xl:w-60 ">
                            
                            <img
                              src={profileImage ? profileImage : userImage }
                              alt=""
                              className="
                              md:h-full md:w-full md:rounded-full
                              lg:h-full lg:w-full lg:rounded-full
                              xl:h-full xl:w-full xl:rounded-full
                              2xl:h-full 2xl:w-full 2xl:rounded-full"
                            />
                            
                            <button className="
                            md:absolute md:bottom-2 md:right-2 md:p-2 md:rounded-full md:shadow-lg md:transition-all md:delay-75 md:ease-in md:hover:bg-[#8791af]
                            lg:absolute lg:bottom-2 lg:right-2 lg:p-2 lg:rounded-full lg:shadow-lg lg:transition-all lg:delay-75 lg:ease-in lg:hover:bg-[#8791af]
                            xl:absolute xl:bottom-2 xl:right-2 xl:p-2 xl:rounded-full xl:shadow-lg xl:transition-all xl:delay-75 xl:ease-in xl:hover:bg-[#8791af]
                            2xl:absolute 2xl:bottom-2 2xl:right-2 2xl:p-2 2xl:rounded-full 2xl:shadow-lg 2xl:transition-all 2xl:delay-75 2xl:ease-in 2xl:hover:bg-[#8791af]"
                              onClick={openEditBox}
                            >
                              <PenLine />
                            </button>

                            {/* </div> */}
                          </div>
                        </>
                      ) : (
                        <EditBox closeButtonFunction={closeEditBox} userProfileImage={userImage} />
                      )}


                      {/* NAME */}
                      <div className=" 
                      md:w-[80%] md:flex md:flex-col md:justify-center md:items-center 
                      lg:w-[80%] lg:flex lg:flex-col lg:justify-center lg:items-center 
                      xl:w-[80%] xl:flex xl:flex-col xl:justify-center xl:items-center 
                      2xl:w-[80%] 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center ">
                        
                        <div
                          className=" 
                          md:w-full md:text-3xl md:font-bold md:flex md:justify-center md:items-center
                          lg:w-full lg:text-4xl lg:font-bold lg:flex lg:justify-center lg:items-center
                          xl:w-full xl:text-4xl xl:font-bold xl:flex xl:justify-center xl:items-center
                          2xl:w-full 2xl:text-4xl 2xl:font-bold 2xl:flex 2xl:justify-center 2xl:items-center"
                          id="fullName"
                        >
                          {userDetails.fullName}
                        </div>

                        {/* BIO */}
                        <div className="
                        md:w-full md:text-base md:text-center md:text-gray-700 md:font-base md:flex md:justify-center md:items-center
                        lg:w-full lg:text-base lg:text-center lg:text-gray-700 lg:font-base lg:flex lg:justify-center lg:items-center
                        xl:w-full xl:text-xl xl:text-center xl:text-gray-700 xl:font-base xl:flex xl:justify-center xl:items-center
                        2xl:w-full 2xl:text-xl 2xl:text-center 2xl:text-gray-700 2xl:font-base 2xl:flex 2xl:justify-center 2xl:items-center ">
                          {userDetails.bio}
                        </div>
                      </div>
                    </div>

                    {/* extra link wala div */}
                    <div className="
                    md:h-[15%] md:w-full md:font-semibold md:flex md:flex-col md:text-black md:justify-center md:items-center md:gap-y-3
                    lg:h-[15%] lg:w-full lg:font-semibold lg:flex lg:flex-col lg:text-black lg:justify-center lg:items-center lg:gap-y-3
                    xl:h-[15%] xl:w-full xl:font-semibold xl:flex xl:flex-col xl:text-black xl:justify-center xl:items-center xl:gap-y-3
                    2xl:h-[15%] 2xl:w-full 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:text-black 2xl:justify-center 2xl:items-center 2xl:gap-y-3"></div>

                    {/* button wala div */}

                    <div className=" 
                    md:h-[20%] md:w-full md:flex md:flex-col md:justify-center md:items-center
                    lg:h-[20%] lg:w-full lg:flex lg:flex-col lg:justify-center lg:items-center
                    xl:h-[20%] xl:w-full xl:flex xl:flex-col xl:justify-center xl:items-center
                    2xl:h-[20%] 2xl:w-full 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center">

                      <div className="
                      md:h-[25%] md:w-full md:font-semibold md:text-black md:flex md:justify-center md:items-center
                      lg:h-[25%] lg:w-full lg:font-semibold lg:text-black lg:flex lg:justify-center lg:items-center
                      xl:h-[25%] xl:w-full xl:font-semibold xl:text-black xl:flex xl:justify-center xl:items-center
                      2xl:h-[25%] 2xl:w-full 2xl:font-semibold 2xl:text-black 2xl:flex 2xl:justify-center 2xl:items-center">
                        {userEmail}
                      </div>

                      <div className="
                      md:h-[75%] md:w-full md:flex md:flex-row md:justify-center md:items-center md:gap-x-5 md:rounded-br-3xl
                      lg:h-[75%] lg:w-full lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-x-5 lg:rounded-br-3xl
                      xl:h-[75%] xl:w-full xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-10 xl:rounded-br-3xl
                      2xl:h-[75%] 2xl:w-full 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-10 2xl:rounded-br-3xl">
                        {/* COPY BUTTON */}
                        <Button
                          variant="secondary"
                          className=" 
                          md:h-9 md:w-20 md:text-[0.65rem] md:font-semibold md:flex md:flex-row md:justify-center md:items-center md:gap-x-2 md:transition-all md:delay-75 md:ease-in md:bg-black md:hover:bg-gray-70
                          lg:h-9 lg:w-24 lg:text-xs lg:font-semibold lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-x-2 lg:transition-all lg:delay-75 lg:ease-in lg:bg-black lg:hover:bg-gray-70
                          xl:h-9 xl:w-24 xl:text-xs xl:font-semibold xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-2 xl:transition-all xl:delay-75 xl:ease-in xl:bg-black xl:hover:bg-gray-700
                          2xl:h-9 2xl:w-24 2xl:text-xs 2xl:font-semibold 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-2 2xl:transition-all 2xl:delay-75 2xl:ease-in 2xl:bg-black 2xl:hover:bg-gray-700"
                          onClick={copyURL}
                        >
                          Copy
                          <Link2 className="
                          md:h-4 md:w-4
                          lg:h-4 lg:w-4
                          xl:h-4 xl:w-4
                          2xl:h-4 2xl:w-4" />
                        </Button>

                        {/* EDIT BUTTON */}

                        {
                          loginStatus ? 
                          
                          <Link href="/enterDetails">
                            <Button
                              variant="destructive"
                              className="
                              md:h-9 md:w-20 md:text-[0.65rem] md:font-semibold md:flex md:flex-row md:justify-center md:items-center md:gap-x-2 md:transition-all md:delay-75 md:ease-in md:bg-gray-700 md:hover:bg-gray-800
                              lg:h-9 lg:w-24 lg:text-xs lg:font-semibold lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-x-2 lg:transition-all lg:delay-75 lg:ease-in lg:bg-gray-700 lg:hover:bg-gray-800
                              xl:h-9 xl:w-24 xl:text-xs xl:font-semibold xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-2 xl:transition-all xl:delay-75 xl:ease-in xl:bg-gray-700 xl:hover:bg-gray-800
                              2xl:h-9 2xl:w-24 2xl:text-xs 2xl:font-semibold 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-2 2xl:transition-all 2xl:delay-75 2xl:ease-in 2xl:bg-gray-700 2xl:hover:bg-gray-800"
                            >
                              Edit
                              <PenLine className="
                              md:h-4 md:w-4
                              lg:h-4 lg:w-4
                              xl:h-4 xl:w-4
                              2xl:h-4 2xl:w-4" />
                            </Button>
                          </Link>

                          : 

                          <Link href="/">
                            <Button
                              variant="destructive"
                              className="
                              md:h-9 md:w-20 md:text-[0.65rem] md:font-semibold md:flex md:flex-row md:justify-center md:items-center md:gap-x-2 md:transition-all md:delay-75 md:ease-in md:bg-gray-700 md:hover:bg-gray-800
                              lg:h-9 lg:w-24 lg:text-xs lg:font-semibold lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-x-2 lg:transition-all lg:delay-75 lg:ease-in lg:bg-gray-700 lg:hover:bg-gray-800
                              xl:h-9 xl:w-24 xl:text-xs xl:font-semibold xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-2 xl:transition-all xl:delay-75 xl:ease-in xl:bg-gray-700 xl:hover:bg-gray-800
                              2xl:h-9 2xl:w-24 2xl:text-xs 2xl:font-semibold 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-2 2xl:transition-all 2xl:delay-75 2xl:ease-in 2xl:bg-gray-700 2xl:hover:bg-gray-800"
                            >
                              Create
                            </Button>
                          </Link>

                        }

                        {/* <Link href="/enterDetails">
                          <Button
                            variant="destructive"
                            className="h-9 w-24 text-xs font-semibold flex flex-row justify-center items-center gap-x-2 transition-all delay-75 ease-in bg-gray-700 hover:bg-gray-800"
                          >
                            Edit
                            <PenLine className="h-4 w-4" />
                          </Button>
                        </Link> */}

                        <Button
                          variant="secondary"
                          className="
                          md:h-9 md:w-20 md:text-[0.65rem] md:font-semibold md:flex md:flex-row md:justify-center md:items-center md:gap-x-2 md:transition-all md:delay-75 md:ease-in md:bg-blue-900
                          lg:h-9 lg:w-24 lg:text-xs lg:font-semibold lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-x-2 lg:transition-all lg:delay-75 lg:ease-in lg:bg-blue-900
                          xl:h-9 xl:w-24 xl:text-xs xl:font-semibold xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-2 xl:transition-all xl:delay-75 xl:ease-in xl:bg-blue-900
                          2xl:h-9 2xl:w-24 2xl:text-xs  2xl:font-semibold 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-2 2xl:transition-all 2xl:delay-75 2xl:ease-in 2xl:bg-blue-900 2xl:hover:bg-blue-950"
                          onClick={logoutButtonClicked}
                        >
                          Logout
                          <LogOut className="
                          md:h-4 md:w-4
                          lg:h-4 lg:w-4
                          xl:h-4 xl:w-4
                          2xl:h-4 2xl:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE WALA DIV */}
                  <div
                    className="
                    md:h-[92%] md:w-[65%] md:mr-5 md:rounded-l-3xl md:flex md:flex-col md:justify-center md:items-center md:gap-y-4 md:text-white
                    lg:h-[92%] lg:w-[65%] lg:mr-5 lg:rounded-l-3xl lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-4 lg:text-white
                    xl:h-[92%] xl:w-[65%] xl:mr-5 xl:rounded-l-3xl xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-4 xl:text-white
                    2xl:h-[92%] 2xl:w-[65%] 2xl:mr-5 2xl:rounded-l-3xl 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-4 2xl:text-white"
                    id="rightDiv"
                  >
                    {/* twitter github wala div */}
                    <div className="
                    md:h-[21.5%] md:w-[95%] md:flex md:justify-center md:items-center md:gap-x-5
                    lg:h-[21.5%] lg:w-[95%] lg:flex lg:justify-center lg:items-center lg:gap-x-5
                    xl:h-[21.5%] xl:w-[95%] xl:flex xl:justify-center xl:items-center xl:gap-x-5
                    2xl:h-[21.5%] 2xl:w-[95%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:gap-x-5 ">
                      {/* twitter wala div */}
                      <div className="
                      md:h-full md:w-[50%] md:flex md:justify-center md:items-center md:rounded-xl md:shadow-md md:shadow-gray-600
                      lg:h-full lg:w-[50%] lg:flex lg:justify-center lg:items-center lg:rounded-xl lg:shadow-md lg:shadow-gray-600
                      xl:h-full xl:w-[50%] xl:flex xl:justify-center xl:items-center xl:rounded-xl xl:shadow-md xl:shadow-gray-600
                      2xl:h-full 2xl:w-[50%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-gray-600" id="twitterDiv">

                        <div className="
                        md:h-full md:w-[32%] md:flex md:justify-center md:items-center
                        lg:h-full lg:w-[32%] lg:flex lg:justify-center lg:items-center
                        xl:h-full xl:w-[35%] xl:flex xl:justify-center xl:items-center
                        2xl:h-full 2xl:w-[40%] 2xl:flex 2xl:justify-center 2xl:items-center">
                          <FaSquareXTwitter className="
                          md:h-10 md:w-10
                          lg:h-14 lg:w-14
                          xl:h-16 xl:w-16
                          2xl:h-16 2xl:w-16" />
                        </div>

                        <div className="
                        lg:h-full lg:w-[68%] lg:text-xl lg:font-semibold lg:flex lg:flex-col lg:justify-center lg:items-start 
                        xl:h-full xl:w-[65%] xl:text-2xl xl:font-semibold xl:flex xl:flex-col xl:justify-center xl:items-start 
                        2xl:h-full 2xl:w-[60%] 2xl:text-2xl 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-start ">
                          <div>
                            <Link
                              href={`https://x.com/${userDetails.twitterURL}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              @{userDetails.twitterURL}
                            </Link>
                          </div>

                          <div className="
                          lg:text-sm lg:font-base lg:text-gray-400
                          xl:text-sm xl:font-base xl:text-gray-400
                          2xl:text-sm 2xl:font-base 2xl:text-gray-400">
                            X.com
                          </div>

                        </div>
                      </div>

                      {/* github wala div */}
                      <div className="
                      lg:h-full lg:w-[50%] lg:flex lg:justify-center lg:items-center lg:rounded-xl lg:shadow-md lg:shadow-gray-800
                      xl:h-full xl:w-[50%] xl:flex xl:justify-center xl:items-center xl:rounded-xl xl:shadow-md xl:shadow-gray-800
                      2xl:h-full 2xl:w-[50%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-gray-800" id="githubDiv">

                        <div className="
                        lg:h-full lg:w-[32%] lg:flex lg:justify-center lg:items-center
                        xl:h-full xl:w-[35%] xl:flex xl:justify-center xl:items-center
                        2xl:h-full 2xl:w-[40%] 2xl:flex 2xl:justify-center 2xl:items-center">
                          <FaGithub className="
                          lg:h-14 lg:w-14
                          xl:h-16 xl:w-16
                          2xl:h-16 2xl:w-16" />
                        </div>

                        <div className="
                        lg:h-full lg:w-[68%] lg:text-xl lg:font-semibold lg:flex lg:flex-col lg:justify-center lg:items-start
                        xl:h-full xl:w-[65%] xl:text-2xl xl:font-semibold xl:flex xl:flex-col xl:justify-center xl:items-start
                        2xl:h-full 2xl:w-[60%] 2xl:text-2xl 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-start">

                          <div>
                            <Link
                              href={`https://github.com/${userDetails.githubURL}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              @{userDetails.githubURL}
                            </Link>
                          </div>

                          <div className="
                          lg:text-sm lg:font-base lg:text-gray-400
                          xl:text-sm xl:font-base xl:text-gray-400
                          2xl:text-sm 2xl:font-base 2xl:text-gray-400">
                            Github.com
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* linkedin wala div */}
                    <div className="
                    lg:h-[21.5%] lg:w-[95%] lg:flex lg:justify-center lg:items-center lg:rounded-xl lg:shadow-md lg:shadow-[#182B3A]
                    xl:h-[21.5%] xl:w-[95%] xl:flex xl:justify-center xl:items-center xl:rounded-xl xl:shadow-md xl:shadow-[#182B3A]
                    2xl:h-[21.5%] 2xl:w-[95%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-[#182B3A]" id="linkedinDiv">

                      <div className="
                      lg:h-full lg:w-[40%] lg:flex lg:justify-center lg:items-center
                      xl:h-full xl:w-[40%] xl:flex xl:justify-center xl:items-center
                      2xl:h-full 2xl:w-[40%] 2xl:flex 2xl:justify-center 2xl:items-center">

                        <FaLinkedin className="
                        lg:h-16 lg:w-16
                        xl:h-16 xl:w-16
                        2xl:h-16 2xl:w-16" />

                      </div>

                      <div className="
                      lg:h-full lg:w-[60%] lg:text-2xl lg:font-semibold lg:flex lg:flex-col lg:justify-center lg:items-start
                      xl:h-full xl:w-[60%] xl:text-2xl xl:font-semibold xl:flex xl:flex-col xl:justify-center xl:items-start
                      2xl:h-full 2xl:w-[60%] 2xl:text-2xl 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-start">

                        <div>
                          <Link
                            href={`https://linkedin.com/in/${userDetails.linkedinURL}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @{userDetails.linkedinURL}
                          </Link>
                        </div>

                        <div className="
                        lg:text-sm lg:font-base lg:text-blue-200
                        xl:text-sm xl:font-base xl:text-blue-200
                        2xl:text-sm 2xl:font-base 2xl:text-blue-200">
                          LinkedIn.com
                        </div>

                      </div>
                    </div>

                    {/* behance instagram wala div */}
                    <div className="
                    lg:h-[21.5%] lg:w-[95%] lg:flex lg:justify-center lg:items-center lg:gap-x-5 lg:rounded-xl
                    xl:h-[21.5%] xl:w-[95%] xl:flex xl:justify-center xl:items-center xl:gap-x-5 xl:rounded-xl
                    2xl:h-[21.5%] 2xl:w-[95%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:gap-x-5 2xl:rounded-xl">
                      {/* behance wala div */}
                      <div className="
                      lg:h-full lg:w-[44%] lg:flex lg:justify-center lg:items-center lg:rounded-xl lg:shadow-md lg:shadow-[#2c67f2]
                      xl:h-full xl:w-[44%] xl:flex xl:justify-center xl:items-center xl:rounded-xl xl:shadow-md xl:shadow-[#2c67f2]
                      2xl:h-full 2xl:w-[44%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-[#2c67f2] " id="behanceDiv">

                        <div className="
                        lg:h-full lg:w-[36%] lg:flex lg:justify-center lg:items-center
                        xl:h-full xl:w-[36%] xl:flex xl:justify-center xl:items-center
                        2xl:h-full 2xl:w-[36%] 2xl:flex 2xl:justify-center 2xl:items-center">
                          <FaBehance className="
                          lg:h-14 lg:w-14
                          xl:h-16 xl:w-16
                          2xl:h-16 2xl:w-16" />
                        </div>

                        <div className="
                        lg:h-full lg:w-[64%] lg:text-xl lg:font-semibold lg:flex lg:flex-col lg:justify-center lg:items-start lg:overflow-hidden
                        xl:h-full xl:w-[64%] xl:text-2xl xl:font-semibold xl:flex xl:flex-col xl:justify-center xl:items-start xl:overflow-hidden
                        2xl:h-full 2xl:w-[64%] 2xl:text-2xl 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-start 2xl:overflow-hidden">

                          <div>
                            <Link
                              href={`https://behance.com/${userDetails.behanceURL}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              @{userDetails.behanceURL}
                            </Link>
                          </div>

                          <div className="
                          lg:text-sm lg:font-base lg:text-blue-200
                          xl:text-sm xl:font-base xl:text-blue-200
                          2xl:text-sm 2xl:font-base 2xl:text-blue-200">
                            Behance.com
                          </div>

                        </div>
                      </div>

                      {/* instagram wala div */}
                      <div className="
                      lg:h-full lg:w-[67%] lg:flex lg:justify-center lg:items-center lg:rounded-xl lg:shadow-md lg:shadow-[#EC4364] lg:border lg:border-[#EC4364]
                      xl:h-full xl:w-[67%] xl:flex xl:justify-center xl:items-center xl:rounded-xl xl:shadow-md xl:shadow-[#EC4364] xl:border xl:border-[#EC4364]
                      2xl:h-full 2xl:w-[67%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-[#EC4364] 2xl:border 2xl:border-[#EC4364]" id="instagramDiv">

                        <div className="
                        lg:h-full lg:w-[40%] lg:flex lg:justify-center lg:items-center
                        xl:h-full xl:w-[40%] xl:flex xl:justify-center xl:items-center
                        2xl:h-full 2xl:w-[40%] 2xl:flex 2xl:justify-center 2xl:items-center">

                          <FaInstagram className="
                          
                          lg:h-14 lg:w-14
                          xl:h-16 xl:w-16
                          2xl:h-16 2xl:w-16" />

                        </div>

                        <div className="
                        lg:h-full lg:w-[60%] lg:text-xl lg:font-semibold lg:flex lg:flex-col lg:justify-center lg:items-start
                        xl:h-full xl:w-[60%] xl:text-2xl xl:font-semibold xl:flex xl:flex-col xl:justify-center xl:items-start
                        2xl:h-full 2xl:w-[60%] 2xl:text-2xl 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-start">
                          <div>
                            <Link
                              href={`https://instagram.com/${userDetails.instagramURL}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              @{userDetails.instagramURL}
                            </Link>
                          </div>

                          <div className="
                          lg:text-sm lg:font-base lg:text-yellow-100
                          xl:text-sm xl:font-base xl:text-yellow-100
                          2xl:text-sm 2xl:font-base 2xl:text-yellow-100">
                            Instagram.com
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* textarea wala div */}
                    <div className="
                    lg:h-[21.5%] lg:w-[95%] lg:text-lg lg:flex lg:justify-center lg:items-center lg:bg-[#333533] lg:rounded-xl lg:shadow-md lg:shadow-gray-600
                    xl:h-[21.5%] xl:w-[95%] xl:text-lg xl:flex xl:justify-center xl:items-center xl:bg-[#333533] xl:rounded-xl xl:shadow-md xl:shadow-gray-600
                    2xl:h-[21.5%] 2xl:w-[95%] 2xl:text-lg 2xl:flex 2xl:justify-center 2xl:items-center 2xl:bg-[#333533] 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-gray-600">

                      {userDetails.TextArea ? userDetails.TextArea : " Either you run the day or the day runs you " }

                    </div>

                  </div>
            </div>
          </>

        )
      }
    
    </>


  );
}

export default page;
