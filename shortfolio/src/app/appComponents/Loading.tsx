import React from 'react'

function Loading(props: any) {
  return (
    <div className='
    h-screen w-full flex justify-center items-center bg-[#FFF6F2]
    sm:h-screen sm:w-full sm:flex sm:justify-center sm:items-center sm:bg-[#FFF6F2]
    md:h-screen md:w-full md:flex md:justify-center md:items-center md:bg-[#FFF6F2]
    lg:h-screen lg:w-full lg:flex lg:justify-center lg:items-center lg:bg-[#FFF6F2]
    xl:h-screen xl:w-full xl:flex xl:justify-center xl:items-center xl:bg-[#FFF6F2]
    2xl:h-screen 2xl:w-full 2xl:flex 2xl:justify-center 2xl:items-center 2xl:bg-[#FFF6F2]' >

        <div className='
        h-[80%] w-[80%] flex flex-row justify-center items-center gap-x-1
        sm:h-[80%] sm:w-[80%] sm:flex sm:flex-row sm:justify-center sm:items-center sm:gap-x-2
        md:h-[80%] md:w-[80%] md:flex md:flex-row md:justify-center md:items-center md:gap-x-2
        lg:h-[80%] lg:w-[80%] lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-x-2
        xl:h-[80%] xl:w-[80%] xl:flex xl:flex-row xl:justify-center xl:items-center xl:gap-x-2
        2xl:h-[80%] 2xl:w-[80%] 2xl:flex 2xl:flex-row 2xl:justify-center 2xl:items-center 2xl:gap-x-2' >

            <div className='
            text-xl font-semibold
            sm:text-3xl sm:font-semibold
            md:text-3xl md:font-semibold
            lg:text-3xl lg:font-semibold
            xl:text-3xl xl:font-semibold
            2xl:text-3xl 2xl:font-semibold'>
                {props.text}
            </div>

            <div>
                <img src="loadingAnimation.svg" alt="" className='
                h-12 w-12
                sm:h-16 sm:w-16
                md:h-16 md:w-16
                lg:h-16 lg:w-16
                xl:h-16 xl:w-16
                2xl:h-16 2xl:w-16' />
            </div>

        </div>
      
    </div>
  )
}

export default Loading
