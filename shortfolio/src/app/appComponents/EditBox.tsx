'use client'

import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import { makeAspectCrop, centerCrop } from 'react-image-crop';


function EditBox(props: any) {

    const minDimension = 150;
    const aspectRatio = 1;

    const [crop, setCrop] = useState<any>();
   

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

        setCrop(crop);

    }

  return (
    <>
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[80%] w-[60%] flex flex-col justify-center items-center bg-black text-white">
        <button
          className="h-10 w-32 bg-red-500 rounded-md text-black"
          onClick={props.closeButtonFunction}
        >
          Close
        </button>

        <ReactCrop 
            crop={crop}
            onChange = { () => setCrop() } 
            circularCrop
            keepSelection
            aspect={aspectRatio}
            minWidth={minDimension}

        >
            <img src={props.userProfileImage} alt="" onLoad={onImageLoadFunction}/>
        </ReactCrop>
        
      </div>
    </>
  );
}

export default EditBox;
// function makeAspectCrop(arg0: { unit: string; }) {
//     throw new Error("Function not implemented.");
// }

