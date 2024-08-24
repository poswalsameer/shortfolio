'use client'

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import authServiceObject from '../appwrite';
import { useForm, SubmitHandler } from 'react-hook-form';
import databaseServiceObject from '../database.appwrite'
import { useSelector } from 'react-redux'; 
import { useRouter } from 'next/navigation';


function page() {

  
  // const [currentUserFound, setCurrentUserFound] = useState<any>(false);
  // const [userExists, setUserExists] = useState<boolean>(false);
  // const [ username, setUsername ] = useState<string>('');
  const [currentUserDetails, setCurrentUserDetails] = useState<any>({});
  const [currentUserDocument, setCurrentUserDocument] = useState<any>({});

  const router = useRouter();

  // const loginStatus = useSelector( (state: RootState) => state.authCheck.status )
  // console.log("The login status is: ", loginStatus);
  

  // FUNCTION TO CONVERT EMAIL INTO NORMAL STRING
  const convertEmailToString = (data: any) => {

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

  useEffect( () => {
    getCurrentUserDetails();    
  }, [])

  useEffect(() => {
    console.log("details in the second use effect: ", currentUserDetails);
    console.log("The current user details in the stored document is: ", currentUserDocument);
  }, [currentUserDetails])

  // useEffect( () => {

  //   const username = currentUserDetails.name.split(" ").join('');
  //   console.log("The username formed is: ", username);

  // }, [] )


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

      // TODO: Optimise here also, as the image will be uploaded twice when the user clicks this more than once
      const uploadedImage = await uploadImageFunction(data);
      console.log("this log is after calling the image upload function in createDocument function");
      
      // TODO: Create the user after running a query, check if a user with the username already exists or not

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
        profilePhotoFrontend: uploadedImage.$id,
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

  const updateDocument = async ( userEmail: any, data: any ) => {

    const uploadedImage = await uploadImageFunction(data);
    console.log("this log is after calling the image upload function in uploadDocument function");

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
          profilePhotoFrontend: uploadedImage.$id,
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

        // console.log("User not found with the same username");
        

      const updatedUserDetails = await databaseServiceObject.updateUserDetails({
        usernameFrontend: data.username,
        bioFrontend: data.bio,
        twitterFrontend: data.twitterUsername,
        githubFrontend: data.githubUsername,
        instagramFrontend: data.instagramUsername,
        behanceFrontend: data.behanceUsername,
        linkedinFrontend: data.linkedinUsername,
        textFrontend: data.extraText,
        profilePhotoFrontend: uploadedImage.$id,
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


  const { register, handleSubmit } = useForm();

  const detailUpdateButton = async (data: any) => {

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
          localStorage.clear();
        }
        else{
          console.log("Username was not valid");
          
        }
        
        // router.push

      } catch (error) {
        console.log("Error while finding the doc: ", error);
        
      }
      



      // IMAGE UPLOAD IS WORKING FINE
      // if( userExists ){

      //   try {

      //     // HANDLING THE IMAGE UPLOAD FIRST
      //     const uploadedImage = await databaseServiceObject.fileUpload(data.profilePhoto[0]);
  
      //     if( uploadedImage ){
      //       console.log("Image uploaded successfully");
      //     }
      //     else{
      //       console.log("Cannot upload the image");
            
      //     }
  
      //     const updatedDetails =  await databaseServiceObject.userDetails({ 
      //       usernameFrontend: data.username,
      //       bioFrontend: data.bio,
      //       twitterFrontend: data.twitterUsername,
      //       githubFrontend: data.githubUsername,
      //       instagramFrontend: data.instagramUsername,
      //       behanceFrontend: data.behanceUsername,
      //       linkedinFrontend: data.linkedinUsername,
      //       textFrontend: data.extraText,
      //       profilePhotoFrontend: uploadedImage.$id,
      //       fullNameFrontend: data.fullName
      //       })
          
      //     if( updatedDetails ){
      //       console.log("The updated details are: ", updatedDetails);
      //     }
      //     else{
      //       console.log("Error while updating details of the user");
            
      //     }
  
      //   } catch (error:any) {
      //       console.log("Error after clicking the button:", error.message);
            
      //   }

      // }
      // else{

      //   try {

      //     // HANDLING THE IMAGE UPLOAD FIRST
      //     const uploadedImage = await databaseServiceObject.fileUpload(data.profilePhoto[0]);
  
      //     if( uploadedImage ){
      //       console.log("Image uploaded successfully");
      //       console.log(uploadedImage);
      //     }
      //     else{
      //       console.log("Cannot upload the image");
            
      //     }

      //     const createdUser = await databaseServiceObject.userDetails({ usernameFrontend: data.username,
      //     bioFrontend: data.bio,
      //     twitterFrontend: data.twitterUsername,
      //     githubFrontend: data.githubUsername,
      //     instagramFrontend: data.instagramUsername,
      //     behanceFrontend: data.behanceUsername,
      //     linkedinFrontend: data.linkedinUsername,
      //     textFrontend: data.extraText,
      //     profilePhotoFrontend: uploadedImage.$id,
      //     fullNameFrontend: data.fullName
      //     })

      //     if( createdUser ){
      //       console.log( "Created user in the db is: ", createdUser );
      //     }
      //     else{
      //       console.log( "User cannot created" );
      //     }
 
      //   } catch (error) {
          
      //     console.log("Cannot create the user: ", error);
          

      //   }

        

      // }

  }

  return (
    <div className=' h-full w-full flex flex-col justify-center items-center bg-[#FFF6F2] text-black'>

      <div className=' my-20 h-full w-[70%] flex flex-col gap-y-16 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-6xl font-bold'>Let the world know who you are!</h1>
        </div>

        <form onSubmit={handleSubmit(detailUpdateButton)}>
          <div className='flex flex-col justify-center items-center gap-y-6'>
          
          {/* FULL NAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>
            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='fullname' className='text-lg font-bold hover:cursor-pointer'>Your Full Name: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='fullname' placeholder="..." value={ currentUserDetails ? currentUserDetails.name : "" } className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "fullName", {
                required: true,
              } )}

              /> 
            </div>
          </div>

          {/* USERNAME INPUT DIV */}
          <div className=' w-[43rem] flex flex-row justify-between items-center gap-x-20  '>
            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='username' className='text-lg font-bold hover:cursor-pointer'>Your username: </Label>
            </div>
            
            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='username' placeholder="..."
              value={currentUserDocument.username ? currentUserDocument.username : '' }
              className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "username", {
                required: true
              } )}
              
              />
            </div>
          </div>
         
          {/* BIO INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='bio' className='text-lg font-bold hover:cursor-pointer'>Your Bio: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Textarea placeholder='...' 
              value={currentUserDocument.bio ? currentUserDocument.bio : '' }
              id='bio' className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "bio", {
                required: true
              } )}
              
              />
            </div>
          </div>

          {/* TWITTER USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='twitter' className='text-lg font-bold hover:cursor-pointer'>Your Twitter username: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='twitter' placeholder="..." 
              value={currentUserDocument.twitterURL ? currentUserDocument.twitterURL : '' }
              className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "twitterUsername", {
                required: false
              } )}
              />
            </div>
          </div>

          {/* GITHUB USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='github' className='text-lg font-bold hover:cursor-pointer'>Your Github username: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='github' placeholder="..." 
              value={currentUserDocument.githubURL ? currentUserDocument.githubURL : '' }
              className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "githubUsername", {
                required: false
              } )}
              /> 
            </div>
          </div>

          {/* INSTAGRAM USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='insta' className='text-lg font-bold hover:cursor-pointer'>Your Instagram username: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='insta' placeholder="..." 
              value={currentUserDocument.instagramURL ? currentUserDocument.instagramURL : '' }
              className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "instagramUsername", {
                required: false
              } )}
              />
            </div>
          </div>

          {/* BEHANCE USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='behance' className='text-lg font-bold hover:cursor-pointer'>Your Behance username: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='behance' placeholder="..." 
              value={currentUserDocument.behanceURL ? currentUserDocument.behanceURL : '' }
              className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "behanceUsername", {
                required: false
              } )}
              />
            </div>
          </div>

          {/* LINKEDIN USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='linkedin' className='text-lg font-bold hover:cursor-pointer'>Your Linkedin username: </Label>
            </div>  

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='linkedin' placeholder="..." 
              value={currentUserDocument.linkedinURL ? currentUserDocument.linkedinURL : '' }
              className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "linkedinUsername", {
                required: false
              } )}
              />
            </div>
          </div>

          {/* EXTRA TEXT INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='extraText' className='text-lg font-bold hover:cursor-pointer'>Any quote you wanna share: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='extraText' placeholder="..." 
              value={currentUserDocument.TextArea ? currentUserDocument.TextArea : '' }
              className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'
              
              {...register( "extraText", {
                required: false
              } )}
              />
            </div>
          </div>

          {/* PROFILE PHOTO INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='profilePic' className='text-lg font-bold hover:cursor-pointer'>Your Profile Photo: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="file" id='profilePhoto' className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105 hover:cursor-pointer'
              
              {...register( "profilePhoto", {
                required: true
              } )}
              />
            </div>
          </div>
    
            <Button variant="secondary" className='w-52 my-8 font-bold'>Roll into your profile</Button>
          </div>
        </form>

        
        
        
      </div>

    </div>
  )
}

export default page
