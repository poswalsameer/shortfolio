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
                  xl:h-screen xl:w-screen xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-10 xl:text-black
                  2xl:h-screen 2xl:w-screen 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-10 2xl:text-black"
                  id="bodyDiv"
                >
                  {/* LEFT SIDE WALA DIV */}
                  <div
                    className="
                    xl:h-[92%] xl:w-[40%] xl:flex xl:flex-col xl:rounded-r-3xl
                    2xl:h-[92%] 2xl:w-[40%] 2xl:flex 2xl:flex-col 2xl:rounded-r-3xl "
                    id="leftDiv"
                  >
                    {/* profile photo + name + bio wala div */}
                    <div className="
                    xl:h-[70%] xl:w-full xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-16 xl:rounded-tr-3xl
                    2xl:h-[70%] 2xl:w-full 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-16 2xl:rounded-tr-3xl">
                      {/* IMAGE */}

                      {!editMode ? (
                        <>
                          <div className=" 
                          xl:relative xl:h-60 xl:w-60
                          2xl:relative 2xl:h-60 2xl:w-60 ">
                            
                            <img
                              src={profileImage ? profileImage : userImage }
                              alt=""
                              className="
                              xl:h-full xl:w-full xl:rounded-full
                              2xl:h-full 2xl:w-full 2xl:rounded-full"
                            />
                            
                            <button className="
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
                      xl:w-[80%] xl:flex xl:flex-col xl:justify-center xl:items-center 
                      2xl:w-[80%] 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center ">
                        
                        <div
                          className=" 
                          xl:w-full xl:text-4xl xl:font-bold xl:flex xl:justify-center xl:items-center
                          2xl:w-full 2xl:text-4xl 2xl:font-bold 2xl:flex 2xl:justify-center 2xl:items-center"
                          id="fullName"
                        >
                          {userDetails.fullName}
                        </div>

                        {/* BIO */}
                        <div className="
                        xl:w-full xl:text-xl xl:text-center xl:text-gray-700 xl:font-base xl:flex xl:justify-center xl:items-center
                        2xl:w-full 2xl:text-xl 2xl:text-center 2xl:text-gray-700 2xl:font-base 2xl:flex 2xl:justify-center 2xl:items-center ">
                          {userDetails.bio}
                        </div>
                      </div>
                    </div>

                    {/* extra link wala div */}
                    <div className="
                    xl:h-[15%] xl:w-full xl:font-semibold xl:flex xl:flex-col xl:text-black xl:justify-center xl:items-center xl:gap-y-3
                    2xl:h-[15%] 2xl:w-full 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:text-black 2xl:justify-center 2xl:items-center 2xl:gap-y-3"></div>

                    {/* button wala div */}

                    <div className=" 
                    xl:h-[20%] xl:w-full xl:flex xl:flex-col xl:justify-center xl:items-center
                    2xl:h-[20%] 2xl:w-full 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center">

                      <div className="
                      xl:h-[25%] xl:w-full xl:font-semibold xl:text-black xl:flex xl:justify-center xl:items-center
                      2xl:h-[25%] 2xl:w-full 2xl:font-semibold 2xl:text-black 2xl:flex 2xl:justify-center 2xl:items-center">
                        {userEmail}
                      </div>

                      <div className="
                      xl:h-[75%] xl:w-full xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-10 xl:rounded-br-3xl
                      2xl:h-[75%] 2xl:w-full 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-10 2xl:rounded-br-3xl">
                        {/* COPY BUTTON */}
                        <Button
                          variant="secondary"
                          className=" 
                          xl:h-9 xl:w-24 xl:text-xs xl:font-semibold xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-2 xl:transition-all xl:delay-75 xl:ease-in xl:bg-black xl:hover:bg-gray-700
                          2xl:h-9 2xl:w-24 2xl:text-xs 2xl:font-semibold 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-2 2xl:transition-all 2xl:delay-75 2xl:ease-in 2xl:bg-black 2xl:hover:bg-gray-700"
                          onClick={copyURL}
                        >
                          Copy
                          <Link2 className="
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
                              xl:h-9 xl:w-24 xl:text-xs xl:font-semibold xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-2 xl:transition-all xl:delay-75 xl:ease-in xl:bg-gray-700 xl:hover:bg-gray-800
                              2xl:h-9 2xl:w-24 2xl:text-xs 2xl:font-semibold 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-2 2xl:transition-all 2xl:delay-75 2xl:ease-in 2xl:bg-gray-700 2xl:hover:bg-gray-800"
                            >
                              Edit
                              <PenLine className="
                              xl:h-4 xl:w-4
                              2xl:h-4 2xl:w-4" />
                            </Button>
                          </Link>

                          : 

                          <Link href="/">
                            <Button
                              variant="destructive"
                              className="
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
                          xl:h-9 xl:w-24 xl:text-xs xl:font-semibold xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-2 xl:transition-all xl:delay-75 xl:ease-in xl:bg-blue-900
                          2xl:h-9 2xl:w-24 2xl:text-xs  2xl:font-semibold 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-2 2xl:transition-all 2xl:delay-75 2xl:ease-in 2xl:bg-blue-900 2xl:hover:bg-blue-950"
                          onClick={logoutButtonClicked}
                        >
                          Logout
                          <LogOut className="
                          xl:h-4 xl:w-4
                          2xl:h-4 2xl:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE WALA DIV */}
                  <div
                    className="
                    xl:h-[92%] xl:w-[65%] xl:mr-5 xl:rounded-l-3xl xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-4 xl:text-white
                    2xl:h-[92%] 2xl:w-[65%] 2xl:mr-5 2xl:rounded-l-3xl 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-4 2xl:text-white"
                    id="rightDiv"
                  >
                    {/* twitter github wala div */}
                    <div className="
                    2xl:h-[21.5%] 2xl:w-[95%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:gap-x-5 ">
                      {/* twitter wala div */}
                      <div className="
                      2xl:h-full 2xl:w-[50%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-gray-600" id="twitterDiv">

                        <div className="
                        2xl:h-full 2xl:w-[40%] 2xl:flex 2xl:justify-center 2xl:items-center">
                          <FaSquareXTwitter className="
                          2xl:h-16 2xl:w-16" />
                        </div>

                        <div className="2xl:h-full 2xl:w-[60%] 2xl:text-2xl 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-start ">
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
                          2xl:text-sm 2xl:font-base 2xl:text-gray-400">
                            X.com
                          </div>

                        </div>
                      </div>

                      {/* github wala div */}
                      <div className="2xl:h-full 2xl:w-[50%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-gray-800" id="githubDiv">

                        <div className="
                        2xl:h-full 2xl:w-[40%] 2xl:flex 2xl:justify-center 2xl:items-center">
                          <FaGithub className="h-16 w-16" />
                        </div>

                        <div className="
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
                          2xl:text-sm 2xl:font-base 2xl:text-gray-400">
                            Github.com
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* linkedin wala div */}
                    <div className="
                    2xl:h-[21.5%] 2xl:w-[95%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-[#182B3A]" id="linkedinDiv">

                      <div className="
                      2xl:h-full 2xl:w-[40%] 2xl:flex 2xl:justify-center 2xl:items-center">

                        <FaLinkedin className="
                        2xl:h-16 2xl:w-16" />

                      </div>

                      <div className="
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
                        2xl:text-sm 2xl:font-base 2xl:text-blue-200">
                          LinkedIn.com
                        </div>

                      </div>
                    </div>

                    {/* behance instagram wala div */}
                    <div className="
                    2xl:h-[21.5%] 2xl:w-[95%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:gap-x-5 2xl:rounded-xl">
                      {/* behance wala div */}
                      <div className="
                      2xl:h-full 2xl:w-[44%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-[#2c67f2] " id="behanceDiv">

                        <div className="
                        2xl:h-full 2xl:w-[36%] 2xl:flex 2xl:justify-center 2xl:items-center">
                          <FaBehance className="
                          2xl:h-16 2xl:w-16" />
                        </div>

                        <div className="
                        2xl:h-full 2xl:w-[64%] 2xl:text-2xl 2xl:font-semibold 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-start">

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
                          2xl:text-sm 2xl:font-base 2xl:text-blue-200">
                            Behance.com
                          </div>

                        </div>
                      </div>

                      {/* instagram wala div */}
                      <div className="
                      2xl:h-full 2xl:w-[67%] 2xl:flex 2xl:justify-center 2xl:items-center 2xl:rounded-xl 2xl:shadow-md 2xl:shadow-[#EC4364] 2xl:border 2xl:border-[#EC4364]" id="instagramDiv">

                        <div className="
                        2xl:h-full 2xl:w-[40%] 2xl:flex 2xl:justify-center 2xl:items-center">
                          <FaInstagram className="
                          2xl:h-16 2xl:w-16" />
                        </div>

                        <div className="
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
                          2xl:text-sm 2xl:font-base 2xl:text-yellow-100">
                            Instagram.com
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* textarea wala div */}
                    <div className="
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
