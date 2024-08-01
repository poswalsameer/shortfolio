'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link2 } from 'lucide-react';
import { PenLine } from 'lucide-react';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import authServiceObject from '../appwrite';
import { useRouter } from 'next/navigation';
import { checkLogout } from '../features/auth.slice';
import { useDispatch } from 'react-redux';


function page({params}:{params:any}) {

    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();

    const logoutButtonClicked = async () => {

        setError('');

        try {
            
            await authServiceObject.logoutUser();
            dispatch(checkLogout());
            router.push('/login');

        } catch (error: any) {
            setError(error.message);
        }

    }

  return (
    // <div>
    //   {params.userProfile}
    // </div>

    <div className=' h-screen w-screen flex flex-row justify-center items-center gap-x-10 bg-[#FFF6F2] text-black'>

        {/* LEFT SIDE WALA DIV */}
        <div className='h-[92%] w-[40%] bg-red-500 flex flex-col rounded-r-3xl '>

            {/* profile photo + name + bio wala div */}
            <div className='h-[65%] w-full bg-red-300 flex flex-col justify-center items-center gap-y-5 rounded-tr-3xl'>

                {/* IMAGE */}
                <div className=' h-52 w-52 rounded-full bg-white'>
                </div>

                {/* NAME */}
                <div className=' w-[80%] text-3xl font-bold flex justify-center items-center'>
                    {params}
                </div>

                {/* BIO */}
                <div className='w-[80%] text-lg text-center text-gray-400 font-bold flex justify-center items-center'>
                    This is the bio which I have written and it is dummy right now, so you are seeing this text.
                </div>


            </div>

            {/* extra link wala div */}
            <div className='h-[20%] w-full bg-blue-200 flex flex-col justify-center items-center gap-y-3'>

            </div>

            {/* button wala div */}
            <div className='h-[15%] w-full bg-yellow-100 flex flex-row justify-center items-center gap-x-10 rounded-br-3xl'>

            {/* COPY BUTTON */}
            <Button variant="secondary" className=' w-32 font-bold flex flex-row justify-center items-center gap-x-2'>
                Copy
                <Link2 />
            </Button>

            {/* EDIT BUTTON */}
            <Link href='/enterDetails'>
                <Button variant="destructive" className='w-32 font-bold flex flex-row justify-center items-center gap-x-2'>
                    Edit
                    <PenLine />
                </Button>
            </Link>

            <Button variant="secondary" className='w-32 font-bold flex flex-row justify-center items-center gap-x-2' onClick={logoutButtonClicked}>
                    Logout
                    <LogOut />
            </Button>

            </div>
                
        </div>

        {/* RIGHT SIDE WALA DIV */}
        <div className='h-[92%] w-[65%] bg-green-500 rounded-l-3xl flex flex-col justify-center items-center gap-y-4 text-white'>

            {/* twitter github wala div */}
            <div className='h-[21.5%] w-[95%] flex justify-center items-center gap-x-5 '>

                {/* twitter wala div */}
                <div className='h-full w-[50%] flex justify-center items-center rounded-xl bg-black'>
                    TWITTER ACCOUNT
                </div>
                
                {/* github wala div */}
                <div className='h-full w-[50%] flex justify-center items-center rounded-xl bg-slate-500'>
                    GITHUB ACCOUNT
                </div>

            </div>

            {/* linkedin wala div */}
            <div className='h-[21.5%] w-[95%] flex justify-center items-center bg-blue-600 rounded-xl'>
                LINKEDIN ACCOUNT
            </div>

            {/* behance instagram wala div */}
            <div className='h-[21.5%] w-[95%] flex justify-center items-center gap-x-5 rounded-xl'>

                {/* behance wala div */}
                <div className='h-full w-[28%] flex justify-center items-center rounded-xl bg-orange-600'>
                    BEHANCE ACCOUNT
                </div>

                {/* instagram wala div */}
                <div className='h-full w-[72%] flex justify-center items-center rounded-xl bg-purple-600'>
                    INSTAGRAM ACCOUNT
                </div>

            </div>

            {/* textarea wala div */}
            <div className='h-[21.5%] w-[95%] flex justify-center items-center bg-black rounded-xl'>
                EXTRA TEXT AREA
            </div>
            
        </div>

    </div>
  )
}

export default page
