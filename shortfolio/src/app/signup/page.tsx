'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/Link";

function page() {

  console.log(process.env.NEXT_PUBLIC_APPWRITE_URL!);
  

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className=' h-screen w-screen flex flex-col justify-center items-center bg-[#FFF6F2] text-black'>

        <div className='h-[80%] w-[70%] flex flex-col gap-y-10 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-9xl font-bold'>Shortfolio.</h1>
          {/* <h1 className='text-2xl text-gray-500 '>Login</h1> */}
        </div>

        <div className='flex flex-col justify-center items-center gap-y-6'>
            <Input type="text" placeholder="Full Name" value={fullName} onChange={ (e) => setFullName(e.target.value) } />
            <Input type="text" placeholder="Username" value={username} onChange={ (e) => setUsername(e.target.value) } />
            <Input type="email" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value) } />
            <Input type="password" placeholder="Password" value={password} onChange={ (e) => setPassword(e.target.value) } />

            <Link href="/signupComplete">
              <Button variant="destructive">Create account</Button>
            </Link>
        </div>

        </div>

        <div className='h-[20%] w-full' id='loginImage'>
        {/* yaha homepage wali image hai */}
      </div>
      
    </div>
  )
}

export default page
