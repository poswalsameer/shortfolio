import React from 'react'
import { checkLogin, checkLogout } from "../features/auth.slice";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';

function Homepage() {

    

  return (
    <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black' id='homepageID'>

      {/* CENTER ME CONTENT */}
      <div className='h-[80%] w-[70%] flex flex-col gap-y-12 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
          <h1 className='text-2xl text-gray-500 '>Show the world who you are</h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-y-3'>
          <Button variant="secondary">Create your shortfolio</Button>
          <Button variant="destructive" className='h-9 '>Login</Button>
        </div>
      </div>

      <div className='h-[20%] w-full' id='homepageImage'>
        {/* yaha homepage wali image hai */}
      </div>

     

    </div>
  )
}

export default Homepage
