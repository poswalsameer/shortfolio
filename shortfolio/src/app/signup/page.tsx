import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function page() {
  return (
    <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black'>

        <div className='h-[80%] w-[70%] flex flex-col gap-y-12 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
          {/* <h1 className='text-2xl text-gray-500 '>Login</h1> */}
        </div>

        <div className='flex flex-col justify-center items-center gap-y-6'>
            <Input type="text" placeholder="Username" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Button variant="destructive">Create account</Button>
        </div>

        </div>

        <div className='h-[20%] w-full' id='loginImage'>
        {/* yaha homepage wali image hai */}
      </div>
      
    </div>
  )
}

export default page
