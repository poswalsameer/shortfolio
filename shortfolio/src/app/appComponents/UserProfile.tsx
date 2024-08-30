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

      setLoading(false);
      router.push("/login");
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
        console.log("Details of the current user: ", currentUser);

        // Converting the email to normal string
        const convertedEmail = convertEmailToString(currentUser.email);
        console.log("Converted mail: ", convertedEmail);

        //setting the email in the state
        setUserEmail(currentUser.email);

        //find document with string mail id
        const userEmail = await databaseServiceObject.getUser(convertedEmail);

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
                  className=" h-screen w-screen flex flex-row justify-center items-center gap-x-10 text-black"
                  id="bodyDiv"
                >
                  {/* LEFT SIDE WALA DIV */}
                  <div
                    className="h-[92%] w-[40%] flex flex-col rounded-r-3xl "
                    id="leftDiv"
                  >
                    {/* profile photo + name + bio wala div */}
                    <div className="h-[70%] w-full flex flex-col justify-center items-center gap-y-16 rounded-tr-3xl">
                      {/* IMAGE */}

                      {!editMode ? (
                        <div className="h-60 w-60 rounded-full">
                          <button className=" relative" onClick={openEditBox}>
                            <PenLine />
                          </button>
                          <img
                            src={profileImage ? profileImage : userImage }
                            alt=""
                            className="h-full w-full rounded-full"
                          />
                        </div>
                      ) : (
                        <EditBox closeButtonFunction={closeEditBox} userProfileImage={userImage} />
                      )}


                      {/* NAME */}
                      <div className=" w-[80%] flex flex-col justify-center items-center ">
                        <div
                          className=" w-full text-4xl font-bold flex justify-center items-center"
                          id="fullName"
                        >
                          {userDetails.fullName}
                        </div>

                        {/* BIO */}
                        <div className="w-full text-xl text-center text-gray-700 font-base flex justify-center items-center ">
                          {userDetails.bio}
                        </div>
                      </div>
                    </div>

                    {/* extra link wala div */}
                    <div className="h-[15%] w-full font-semibold flex flex-col text-black justify-center items-center gap-y-3"></div>

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
                          onClick={copyURL}
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
                      <div className="h-full w-[50%] flex justify-center items-center rounded-xl bg-black shadow-md shadow-gray-600">
                        <div className="h-full w-[40%] flex justify-center items-center">
                          <FaSquareXTwitter className="h-16 w-16" />
                        </div>

                        <div className="h-full w-[60%] text-2xl font-semibold flex flex-col justify-center items-start ">
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
                      <div className="h-full w-[50%] flex justify-center items-center rounded-xl bg-[#25292F] shadow-md shadow-gray-800">
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
                              Github
                            </Link>
                          </div>

                          <div className="text-sm font-base text-gray-400">@{userDetails.githubURL}</div>
                        </div>
                      </div>
                    </div>

                    {/* linkedin wala div */}
                    <div className="h-[21.5%] w-[95%] flex justify-center items-center bg-[#086BC9] border border-blue-600 rounded-xl shadow-md shadow-blue-700">
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
                      <div className="h-full w-[40%] flex justify-center items-center rounded-xl bg-[#0057FF] shadow-md shadow-blue-800 border border-[#0057FF]">
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
                      <div className="h-full w-[67%] flex justify-center items-center rounded-xl bg-[#FF7D43] shadow-md shadow-[#d37c54] border border-[#FF7D43]">
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
                    <div className="h-[21.5%] w-[95%] text-lg flex justify-center items-center bg-[#333533] rounded-xl shadow-md shadow-gray-600">
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
