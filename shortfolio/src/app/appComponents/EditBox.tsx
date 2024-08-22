'use client'

import React, { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import { makeAspectCrop, centerCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'


function EditBox(props: any) {

    const minDimension = 150;
    const aspectRatio = 1;

    const [crop, setCrop] = useState<Crop>();
   

    const onImageLoadFunction = (e:any) => {

        const {width, height} = e.currentTarget;

        const crop = makeAspectCrop({
            unit: "px",
            width: minDimension,
        }, 
        aspectRatio,
        width, 
        height
        )

        const centeredCrop = centerCrop(crop, width, height);

        setCrop(centeredCrop);

    }

  return (
    <>
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[90%] w-[40%] flex flex-col justify-center items-center bg-black text-white rounded-2xl">

        <div className="flex justify-center items-center font-semibold text-xl">EDIT IMAGE</div>
        
        {/* THE CROP FEATURE */}
        <ReactCrop 
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)} 
            circularCrop
            keepSelection
            aspect={aspectRatio}
            minWidth={minDimension}
            className="h-72 w-64 my-14"
        >
            <img src={props.userProfileImage} alt="" onLoad={onImageLoadFunction} className="h-72 w-64"/>
        </ReactCrop>
        

        {/* BUTTONS WALA DIV */}
        <div className="flex justify-center items-center w-full gap-x-3">

          <button className="h-10 w-32 bg-green-500 rounded-md text-black">
            Save
          </button>

          <button
            className="h-10 w-32 bg-red-500 rounded-md text-black"
            onClick={props.closeButtonFunction}
          >
            Close
          </button>

        </div>
        

      </div>
    </>
  );
}

export default EditBox;
// function makeAspectCrop(arg0: { unit: string; }) {
//     throw new Error("Function not implemented.");
// }

