import React from 'react'
import { checkLogin, checkLogout } from "../features/auth.slice";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import authServiceObject from '../appwrite';
import { useRouter } from 'next/navigation';

function Homepage() {

  const router = useRouter();

  const loginButtonClicked = async () => {

    // GETTING ANY ACTIVE SESSION IF ANY
    const currentSession = await authServiceObject.getCurrentSession();

    if( currentSession ){
        // IF CURRENT SESSION EXISTS, THEN FIND THE USER DETAILS
        const currentUser = await authServiceObject.getLoggedInUser();

        if( currentUser ){
          // IF USER EXISTS, THEN DIRECTLY REDIRECT TO THE USER PROFILE
          const user = currentUser.name.split(" ").join('');
          router.push(`/${user}`)
        }
    }
    else{
      // IF SESSION NOT FOUND, THEN REDIRECT TO LOGIN PAGE
      router.push('/login');
    }

  }
    

  return (
    <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black' id='homepageID'>

      {/* CENTER ME CONTENT */}
      <div className='h-[80%] w-[70%] flex flex-col gap-y-12 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
          <h1 className='text-2xl text-gray-500 '>Show the world who you are</h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-y-6'>
          <Link href="/signup">
            <Button variant="secondary" >Create your shortfolio</Button>
          </Link>
          {/* <Link href="/login"> */}
            <Button variant="destructive" className='h-9 ' onClick={loginButtonClicked}>Login</Button>
          {/* </Link> */}
        </div>
      </div>

      <div className='h-[20%] w-full' id='homepageImage'>
        {/* yaha homepage wali image hai */}
      </div>

     

    </div>
  )
}

export default Homepage
