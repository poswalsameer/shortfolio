import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

function page() {
  return (
    <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black'>

    <div className='h-[80%] w-[70%] flex flex-col gap-y-14 justify-center items-center'>

    <div className='flex flex-col justify-center items-center gap-y-1'>
      <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
      {/* <h1 className='text-2xl text-gray-500 '>Login</h1> */}
    </div>

    <div className='flex flex-col justify-center items-center gap-y-6'>
        <img src="smiley.png" alt="" className='h-24 w-24' />
        <h1 className='text-xl text-gray-500 '> You are now the official member of the Shortfolio Community. Cheers on this feat! </h1>
        <Link href='/home'>
          <Button variant="secondary" className='h-9 '>Let's go</Button>
        </Link>
    </div>

    </div>

    <div className='h-[20%] w-full' id='createShortfolioImage'>
    {/* yaha homepage wali image hai */}
  </div>
  
</div>
  )
}

export default page
