import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@/components/ui/Label';
import Link from 'next/link';

function page() {
  return (
    <div className=' h-full w-full flex flex-col justify-center items-center bg-[#FFF6F2] text-black'>

      <div className=' my-20 h-full w-[70%] flex flex-col gap-y-16 justify-center items-center'>

        <div className='flex flex-col justify-center items-center gap-y-1'>
          <h1 className=' text-6xl font-bold'>Let the world know who you are!</h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-y-6'>
          
          {/* FULL NAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>
            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='fullname' className='text-lg font-bold hover:cursor-pointer'>Your Full Name: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='fullname' placeholder="..." className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/> 
            </div>
          </div>

          {/* USERNAME INPUT DIV */}
          <div className=' w-[43rem] flex flex-row justify-between items-center gap-x-20  '>
            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='username' className='text-lg font-bold hover:cursor-pointer'>Enter your username: </Label>
            </div>
            
            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='username' placeholder="..." className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/>
            </div>
          </div>
         
          {/* BIO INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='bio' className='text-lg font-bold hover:cursor-pointer'>Your Bio: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Textarea placeholder='...' id='bio' className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/>
            </div>
          </div>

          {/* TWITTER USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='twitter' className='text-lg font-bold hover:cursor-pointer'>Your Twitter username: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='twitter' placeholder="..." className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/>
            </div>
          </div>

          {/* GITHUB USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='github' className='text-lg font-bold hover:cursor-pointer'>Your Github username: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='github' placeholder="..." className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/> 
            </div>
          </div>

          {/* INSTAGRAM USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='insta' className='text-lg font-bold hover:cursor-pointer'>Your Instagram username: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='insta' placeholder="..." className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/>
            </div>
          </div>

          {/* BEHANCE USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='behance' className='text-lg font-bold hover:cursor-pointer'>Your Behance username: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='behance' placeholder="..." className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/>
            </div>
          </div>

          {/* LINKEDIN USERNAME INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='linkedin' className='text-lg font-bold hover:cursor-pointer'>Your Linkedin username: </Label>
            </div>  

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='linkedin' placeholder="..." className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/>
            </div>
          </div>

          {/* EXTRA TEXT INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='extraText' className='text-lg font-bold hover:cursor-pointer'>Any quote you wanna share: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="text" id='extraText' placeholder="..." className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105'/>
            </div>
          </div>

          {/* PROFILE PHOTO INPUT DIV */}
          <div className='w-[43rem] flex flex-row justify-between items-center gap-x-20 '>

            <div className='h-[50%] w-[50%] flex justify-end' >
              <Label htmlFor='profilePic' className='text-lg font-bold hover:cursor-pointer'>Your Profile Photo: </Label>
            </div>

            <div className='h-[50%] w-[50%] flex justify-start' >
              <Input type="file" id='profilePic' className='bg-white focus:bg-blue-100 border-blue-700 w-96 transition-all delay-75 focus:scale-105 hover:cursor-pointer'/>
            </div>
          </div>
    
        </div>

        <Link href='/poswalsameer'>
            <Button variant="secondary" className='w-52 font-bold'>Roll into your profile</Button>
          </Link>
        
        
      </div>

    </div>
  )
}

export default page
