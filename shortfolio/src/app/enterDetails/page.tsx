'use client'

import React, { useEffect, useState } from 'react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Label } from '../../components/ui/label';
// import Link from 'next/link';
import authServiceObject from '../appwrite';
import { useForm, SubmitHandler } from 'react-hook-form';
import databaseServiceObject from '../database.appwrite'
import { useSelector } from 'react-redux'; 
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Loading from '../appComponents/Loading'


function Page() {

  const [currentUserDetails, setCurrentUserDetails] = useState<any>({});
  const [currentUserDocument, setCurrentUserDocument] = useState<any>({});
  const [imageInDB, setImageInDB] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageOfUser, setImageOfUser] = useState<string>('');

  const { register, handleSubmit, reset,formState: { errors } } = useForm();

  // if( errors.fullName?.message ){
  //   alert(errors.fullName?.message);
  // }

  const router = useRouter();
  const {toast} = useToast();

  // FUNCTION TO CONVERT EMAIL INTO NORMAL STRING
  const convertEmailToString = (data: any) => {

    // length of the data incoming
      let n = data.length;
      let convertedString = "";

      for(let i=0; i<n; i++){
          if( data[i] === '@' || data[i] === '.' ){
            convertedString = convertedString + '0';
          }
          else{
            convertedString = convertedString + data[i];
          }
      }

      return convertedString;

  }

  const getCurrentUserDetails = async () => {

    try {

      setCurrentUserDetails({});
      const currentUser = await authServiceObject.getLoggedInUser();

      if( currentUser ){
          console.log("get current user method running");   
          
          const convertedEmail = convertEmailToString(currentUser.email);
          console.log("Email converted: ", convertedEmail);
          
          const currentUserDoc = await databaseServiceObject.getUser(convertedEmail); 

          if( currentUserDoc ){
            setCurrentUserDocument(currentUserDoc);
            setImageOfUser(currentUserDoc.profilePhoto);
          }
          else{
            console.log("User doc not found");
          }
          
          //WHEN USER SIGNS UP AND THEN COMES ON THIS PAGE, THEN THIS currentUser OBJECT WILL BE EMPTY
          setCurrentUserDetails(currentUser);
      }
      else{
        console.log("Cannot fetch the current user from backend");
      }
    } catch (error) {
      console.log("Cannot get the current user details: ", error);
    }
  }

  // FUNCTION TO UPLOAD IMAGE ON APPWRITE
  const uploadImageFunction = async (data: any) => {

        const uploadedImage = await databaseServiceObject.fileUpload(data.profilePhoto[0]);

        if( uploadedImage ){
          console.log("Image uploaded successfully : INSIDE THE UPLOAD IMAGE FUNCTION");
          return uploadedImage;
        }
        else{
          console.log("Image cannot be uploaded : INSIDE THE UPLOAD IMAGE FUNCTION");
          
        }

  }

  // CREATING A FUNCTION THAT CREATES A NEW DOCUMENT WITH THE USERNAME
  const createDocument = async (userId: any, data: any) => {

      
      let uploadedImage;
      if( data.profilePhoto ){
        uploadedImage = await uploadImageFunction(data);
        console.log("this log is after calling the image upload function in createDocument function");
      }
      else{
        console.log("Cannot upload the image because image was not uploaded");
        
      }      
      

      const findUser = await databaseServiceObject.getUser(data.username);

      if( findUser ){
        alert(" Username already exists : INSIDE CREATE DOCUMENT FUNCTION ");
      }
      else{

        const createdUser = await databaseServiceObject.userDetails({
        usernameFrontend: data.username,
        bioFrontend: data.bio,
        twitterFrontend: data.twitterUsername,
        githubFrontend: data.githubUsername,
        instagramFrontend: data.instagramUsername,
        behanceFrontend: data.behanceUsername,
        linkedinFrontend: data.linkedinUsername,
        textFrontend: data.extraText,
        profilePhotoFrontend: uploadedImage ? uploadedImage.$id : '',
        fullNameFrontend: data.fullName,
        emailFrontend: userId
      })

      if( createdUser ){
        console.log("User created successfully!");
        return createdUser;
      }
      else{
        console.log("Cannot create the user!");
      }


      }

  }

  // FUNCTION THAT GETS A FILE ID
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

  // FUNCTION THAT UPDATES A DOCUMENT
  // TODO: issue ye hai ki, agar profile photo daalte hai to upload hori hai wo bucket par but agar profile photo nahi daalre to storage me upload nahi hori, iss wajah se wo available nahi hai
  const updateDocument = async ( userEmail: any, data: any ) => {

    let uploadedImage;

    console.log("The type of the profilePhoto in the data coming from input is: ", typeof data.profilePhoto);

    if( typeof data.profilePhoto === "string" ){
      // setImageOfUser(data.profilePhoto);
      uploadedImage = data.profilePhoto;
      console.log("Image set in the state because the profile photo in the data is of type string");
    }
    else{
      uploadedImage = await uploadImageFunction(data);
      console.log("This is the uploadedImage returned from the upload image function:", uploadedImage);
      
      uploadedImage = uploadedImage.$id;
      console.log("Image uploaded successfully, and the value of uploadedImage after uploading it is: ", imageOfUser);
    }

    console.log("Image stored in the state imageOfUser is: ", imageOfUser);
    

    // if( data.profilePhoto ){
    //   uploadedImage = await uploadImageFunction(data);
    //   console.log("This is the uploadedImage returned from the upload image function:", uploadedImage);
      
    //   setImageOfUser(uploadedImage.$id);
    //   console.log("Image uploaded successfully, and the value of uploadedImage after uploading it is: ", imageOfUser);
    // }

    // finding the username entered in the input field in document database
    const findUser = await databaseServiceObject.getAllDocuments(data.username);
    console.log("Searching for username:", data.username);
    console.log( "Find User: ", findUser);
    

    // IF USER IS FOUND WITH ENTERED USERNAME, THEN WO GO IN THIS IF STATEMENT
    if( findUser ){
      console.log("Details of the existing user: ", findUser);

      // IF THE USER ENTERED A NEW USERNAME, AND THE NEW USERNAME ALREADY EXISTS, THEN WE DO THE BELOW THING

      //getting the ID of the returned document
      const returnedDocID = findUser.$id;
      console.log( "ID of the returned document: ", returnedDocID);
      

      // if the ID of the returned document is same as of userEmail, this means user didn't changed his username while updating the details, so we can simply update the document with new details
      if( returnedDocID === userEmail ){

        const updatedUserDetails = await databaseServiceObject.updateUserDetails({
          usernameFrontend: data.username,
          bioFrontend: data.bio,
          twitterFrontend: data.twitterUsername,
          githubFrontend: data.githubUsername,
          instagramFrontend: data.instagramUsername,
          behanceFrontend: data.behanceUsername,
          linkedinFrontend: data.linkedinUsername,
          textFrontend: data.extraText,
          // profilePhotoFrontend: typeof uploadedImage === "string" ? ( uploadedImage || '' ) : ( uploadedImage.$id || '' ) ,
          profilePhotoFrontend: uploadedImage ? uploadedImage : '',
          fullNameFrontend: data.fullName,
          emailFrontend: userEmail
        })

        if( updatedUserDetails ){
          console.log("These are the details after updating: ", updatedUserDetails);
        }
        else{
          console.log("There is some error while updating the user details : INSIDE THE IF WHERE WE ARE CHECKING THE DOC IDs ");
        }

      }
      else if( returnedDocID !== userEmail ){
        alert("Username already exists");
      }

    }

    //IF USER NOT FOUND WITH ENTERED USERNAME, THEN UPDATE DETAILS WITH NEW USERNAME
    else{

      const updatedUserDetails = await databaseServiceObject.updateUserDetails({
        usernameFrontend: data.username,
        bioFrontend: data.bio,
        twitterFrontend: data.twitterUsername,
        githubFrontend: data.githubUsername,
        instagramFrontend: data.instagramUsername,
        behanceFrontend: data.behanceUsername,
        linkedinFrontend: data.linkedinUsername,
        textFrontend: data.extraText,
        profilePhotoFrontend: uploadedImage ? uploadedImage.$id : null,
        fullNameFrontend: data.fullName,
        emailFrontend: userEmail
      })

      if( updatedUserDetails ){
        console.log("Details of the user after updating the document : INSIDE IF WHEN USER IS NOT FOUND WITH THE SAME ENTERED USERNAME", updatedUserDetails);
      }
      else{
        console.log("There is some error while updating the user details : INSIDE IF WHEN USER IS NOT FOUND WITH THE SAME ENTERED USERNAME.");
        
      }

    }

  }

  // USE EFFECT TO HANDLE THE TOAST WHEN THERE THE FULLNAME FIELD IS EMPTY
  useEffect(() => {
    if (errors.fullName?.message) {
      toast({
        title: errors.fullName?.message as string,
      });
    }

    if( errors.username?.message ){
      toast({
        title: errors.username?.message as string,
      });
    }

    if( errors.bio?.message ){
      toast({
        title: errors.bio?.message as string,
      });
    }
  }, [errors.fullName, errors.username, errors.bio]);

  // FUNCTION THAT TRIGGERS WHEN BUTTON IS CLICKED
  const detailUpdateButton = async (data: any) => {

      setLoading(true);

      console.log("The data coming from these input field is: ", data);
      console.log("The email coming from the user detail is: ", currentUserDetails.email);
      let userEmail = currentUserDetails.email;

      

      userEmail = convertEmailToString(userEmail);
      console.log("This is user email after converting the string: ", userEmail);
      
      // FINDING A DOCUMENT WITH ID OF THIS EMAIL
      try {
        const userDocument = await databaseServiceObject.getUser(userEmail);
      
        if( userDocument ){

          console.log("Details of the user before updating: ", data);
          
          const updatedDetailOfTheUser  = await updateDocument(userEmail, data);
          console.log("Details of the user after updating: ", updatedDetailOfTheUser);
          
        }
        else{
          console.log("Document with this id does not exists");

          // data.profilePhoto
          const createdUser = await createDocument(userEmail, data);

          if( createdUser ){
            console.log("User created successfully!");
            console.log("Details of the user: ", createdUser);
          }
        }

        const username = currentUserDetails.name.split(" ").join('');
        console.log("The username formed is: ", username);

        if( username ){
          router.push(`/user/${username}`);
          setLoading(false);
          localStorage.clear();
        }
        else{
          setLoading(false);
          console.log("Username was not valid");
          
        }

      } catch (error) {
        setLoading(false);
        console.log("Error while finding the doc: ", error);
        
      }

  }

  useEffect( () => {
    getCurrentUserDetails();
    
    // getImageFromDatabase();
  }, [])

  useEffect(() => {
    console.log("details in the second use effect: ", currentUserDetails);
    console.log("The current user details in the stored document is: ", currentUserDocument);
    console.log("The image found from db is: ", currentUserDocument.profilePhoto);
    // setImageOfUser(currentUserDocument.profilePhoto);
    console.log("The type of the image saved in the currentUserDocument is: ", typeof currentUserDocument.profilePhoto);
    // console.log("Default value inside the imageOfUser state is: ", imageOfUser);
    

    reset({

      fullName: currentUserDetails.name || '',
      username: currentUserDocument.username || '', 
      bio: currentUserDocument.bio || '',
      twitterUsername: currentUserDocument.twitterURL || '',
      githubUsername: currentUserDocument.githubURL || '',
      instagramUsername: currentUserDocument.instagramURL || '',
      behanceUsername: currentUserDocument.behanceURL || '',
      linkedinUsername: currentUserDocument.linkedinURL || '',
      extraText: currentUserDocument.Textarea || '',
      profilePhoto: currentUserDocument.profilePhoto || ''

    })
  }, [currentUserDetails])

  // useEffect(() => {
  //   console.log("Updated imageOfUser state:", imageOfUser);
  // }, [imageOfUser]);

  return (

    <>

      {
        loading ? (

          <> 
            <Loading text="Your profile is ready"/>
          </>

        ) : (

          <>
            <div className='
            h-full w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black
            sm:h-full sm:w-full sm:flex sm:flex-col sm:justify-center sm:items-center sm:bg-[#FFF6F2] sm:text-black
            md:h-full md:w-full md:flex md:flex-col md:justify-center md:items-center md:bg-[#FFF6F2] md:text-black
            lg:h-full lg:w-full lg:flex lg:flex-col lg:justify-center lg:items-center lg:bg-[#FFF6F2] lg:text-black 
            xl:h-full xl:w-full xl:flex xl:flex-col xl:justify-center xl:items-center xl:bg-[#FFF6F2] xl:text-black 
            2xl:h-full 2xl:w-full 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:bg-[#FFF6F2] 2xl:text-black' id='mainDiv'>

              <div className='
              my-20 h-full w-[90%] flex flex-col gap-y-16 justify-center items-center
              sm:my-20 sm:h-full sm:w-[80%] sm:flex sm:flex-col sm:gap-y-16 sm:justify-center sm:items-center
              md:my-20 md:h-full md:w-[80%] md:flex md:flex-col md:gap-y-16 md:justify-center md:items-center
              lg:my-20 lg:h-full lg:w-[80%] lg:flex lg:flex-col lg:gap-y-16 lg:justify-center lg:items-center
              xl:my-20 xl:h-full xl:w-[70%] xl:flex xl:flex-col xl:gap-y-16 xl:justify-center xl:items-center 
              2xl:my-20 2xl:h-full 2xl:w-[70%] 2xl:flex 2xl:flex-col 2xl:gap-y-16 2xl:justify-center 2xl:items-center'>

                <div className='
                flex flex-col justify-center items-center gap-y-1
                sm:flex sm:flex-col sm:justify-center sm:items-center sm:gap-y-1
                md:flex md:flex-col md:justify-center md:items-center md:gap-y-1
                lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-1
                xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-1
                2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-1'>

                  <h1 className='
                  text-xl font-bold
                  sm:text-3xl sm:font-bold
                  md:text-4xl md:font-bold
                  lg:text-5xl lg:font-bold
                  xl:text-5xl xl:font-bold
                  2xl:text-6xl 2xl:font-bold'>
                    Let the world know who you are!
                  </h1>

                </div>

                <form onSubmit={handleSubmit(detailUpdateButton)}>
                  <div className='
                  flex flex-col justify-center items-center gap-y-6
                  sm:flex sm:flex-col sm:justify-center sm:items-center sm:gap-y-6
                  md:flex md:flex-col md:justify-center md:items-center md:gap-y-6
                  lg:flex lg:flex-col lg:justify-center lg:items-center lg:gap-y-6
                  xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-y-6
                  2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-y-6'>
                  
                  {/* FULL NAME INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='fullname' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your Full Name: 
                      </Label>

                    </div>

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="text" id='fullname' placeholder="..."
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "fullName", {
                        required: "Full Name is required",
                      } )}

                      /> 
                    </div>

                  </div>

                  {/* USERNAME INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20  '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='username' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your username: 
                      </Label>

                    </div>
                    
                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="text" id='username' placeholder="..."
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "username", {
                        required: "Username is required",
                      } )}
                      
                      />
                    </div>
                  </div>
                
                  {/* BIO INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='bio' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your Bio: 
                      </Label>

                    </div>

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Textarea placeholder='...' 
                      id='bio' className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "bio", {
                        required: "Bio is required",
                      } )}
                      
                      />
                    </div>
                  </div>

                  {/* TWITTER USERNAME INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='twitter' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your Twitter username: 
                      </Label>

                    </div>

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="text" id='twitter' placeholder="..." 
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "twitterUsername", {
                        required: false
                      } )}
                      />
                    </div>
                  </div>

                  {/* GITHUB USERNAME INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='github' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your Github username: 
                      </Label>

                    </div>

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="text" id='github' placeholder="..." 
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "githubUsername", {
                        required: false
                      } )}
                      /> 
                    </div>
                  </div>

                  {/* INSTAGRAM USERNAME INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='insta' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your Instagram username: 
                      </Label>

                    </div>

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="text" id='insta' placeholder="..." 
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "instagramUsername", {
                        required: false
                      } )}
                      />
                    </div>
                  </div>

                  {/* BEHANCE USERNAME INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='behance' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your Behance username: 
                      </Label>

                    </div>

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="text" id='behance' placeholder="..." 
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "behanceUsername", {
                        required: false
                      } )}
                      />
                    </div>
                  </div>

                  {/* LINKEDIN USERNAME INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='linkedin' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your Linkedin username: 
                      </Label>

                    </div>  

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="text" id='linkedin' placeholder="..." 
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "linkedinUsername", {
                        required: false
                      } )}
                      />
                    </div>
                  </div>

                  {/* EXTRA TEXT INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='extraText' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Any quote you wanna share: 
                      </Label>

                    </div>

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="text" id='extraText' placeholder="..." 
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105'
                      
                      {...register( "extraText", {
                        required: false
                      } )}
                      />
                    </div>
                  </div>

                  {/* PROFILE PHOTO INPUT DIV */}
                  <div className='
                  w-[25rem] flex flex-row justify-between items-center gap-x-3
                  sm:w-[38rem] sm:flex sm:flex-row sm:justify-between sm:items-center sm:gap-x-10
                  md:w-[43rem] md:flex md:flex-row md:justify-between md:items-center md:gap-x-10
                  lg:w-[43rem] lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-x-20
                  xl:w-[43rem] xl:flex xl:flex-row xl:justify-between xl:items-center xl:gap-x-20 
                  2xl:w-[43rem] 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-x-20 '>

                    <div className='
                    h-[50%] w-[50%] flex justify-end
                    sm:h-[50%] sm:w-[50%] sm:flex sm:justify-end
                    md:h-[50%] md:w-[50%] md:flex md:justify-end
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-end
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-end
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-end' >

                      <Label htmlFor='profilePic' className='
                      text-xs font-bold hover:cursor-pointer
                      sm:text-base sm:font-semibold sm:hover:cursor-pointer
                      md:text-lg md:font-bold md:hover:cursor-pointer
                      lg:text-lg lg:font-bold lg:hover:cursor-pointer
                      xl:text-lg xl:font-bold xl:hover:cursor-pointer
                      2xl:text-lg 2xl:font-bold 2xl:hover:cursor-pointer'>
                        Your Profile Photo: 
                      </Label>

                    </div>

                    <div className='
                    h-[50%] w-[50%] flex justify-start
                    sm:h-[50%] sm:w-[60%] sm:flex sm:justify-start
                    md:h-[50%] md:w-[60%] md:flex md:justify-start
                    lg:h-[50%] lg:w-[50%] lg:flex lg:justify-start
                    xl:h-[50%] xl:w-[50%] xl:flex xl:justify-start
                    2xl:h-[50%] 2xl:w-[50%] 2xl:flex 2xl:justify-start' >

                      <Input type="file" id='profilePhoto' 
                      className='
                      bg-white focus:bg-blue-100 border-blue-700 h-8 w-40 transition-all delay-75 focus:scale-105
                      sm:bg-white sm:focus:bg-blue-100 sm:border-blue-700 sm:h-10 sm:w-60 sm:transition-all sm:delay-75 sm:focus:scale-105
                      md:bg-white md:focus:bg-blue-100 md:border-blue-700 md:w-72 md:transition-all md:delay-75 md:focus:scale-105
                      lg:bg-white lg:focus:bg-blue-100 lg:border-blue-700 lg:w-96 lg:transition-all lg:delay-75 lg:focus:scale-105
                      xl:bg-white xl:focus:bg-blue-100 xl:border-blue-700 xl:w-96 xl:transition-all xl:delay-75 xl:focus:scale-105
                      2xl:bg-white 2xl:focus:bg-blue-100 2xl:border-blue-700 2xl:w-96 2xl:transition-all 2xl:delay-75 2xl:focus:scale-105 hover:cursor-pointer'
                      
                      {...register( "profilePhoto", {
                        required: false
                      } )}
                      />
                    </div>
                  </div>

                    <Button variant="secondary" className='
                    w-48 my-8 font-semibold
                    sm:w-52 sm:my-8 sm:font-bold
                    md:w-52 md:my-8 md:font-bold
                    lg:w-52 lg:my-8 lg:font-bold
                    xl:w-52 xl:my-8 xl:font-bold
                    2xl:w-52 2xl:my-8 2xl:font-bold'>
                      Roll into your profile
                    </Button>
                  </div>
                </form>

                
                
                
              </div>

            </div> 
          </>

        )
      }
    

    </>


  )
}

export default Page
