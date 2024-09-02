'use client'

import React, { useContext, useRef, useState } from "react";
import ReactCrop, { convertToPixelCrop, type Crop } from "react-image-crop";
import { makeAspectCrop, centerCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import ImageContext from "../contexts/ImageContext";
import ImageContextProvider from "../contexts/ImageContextProvider";
import setCanvasPreview from "../utils/setCanvas";


function EditBox(props: any) {

    const minDimension = 150;
    const aspectRatio = 1;

    const [crop, setCrop] = useState<Crop>();
    const [newImage, setNewImage] = useState<string>();

    //refs for the image and the canvas
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // GETTING THE CONTEXT FROM THE IMAGE CONTEXT
    const context = useContext(ImageContext);

    // THROW ERROR IF THE CONTEXT IS NOT FOUND
    if (!context) {
      throw new Error("ProfileComponent must be used within an ImageContextProvider");
    }
  
    // GETTING THE STATE AND THE FUNCTION FROM THE CONTEXT
    const { profileImage, setProfileImage } = context;
   

    // FUNCTION THAT SETS THE NEW IMAGE ON THE CANVAS, AND THEN IT GETS TRANSFERRED TO THE USER PROFILE FROM CANVAS BY DATA URL
    const setNewImageToCanvas = () => {

      setCanvasPreview(
        imageRef.current,
        canvasRef.current,
        convertToPixelCrop(
          crop!,
          imageRef.current!.width,
          imageRef.current!.height
        )
      );

      const newSetImage = canvasRef.current!.toDataURL();
      if( newSetImage ){
        setProfileImage(newSetImage)    
      }

      props.closeButtonFunction();

    }

    // FUNCTION THAT DEALS WITH THE CROPPING PART WHEN THE IMAGE GETS LOADED
    const onImageLoadFunction = (e:any) => {

        const {width, height} = e.currentTarget;

        const crop = makeAspectCrop({
            unit: "%",
            width: 50,
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


      <div className=" 
      absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[90%] w-[35%] flex flex-col justify-center items-center text-black rounded-2xl border-2 border-blue-950" id="editBoxDiv">

        <div className="flex justify-center items-center font-semibold text-2xl">EDIT IMAGE</div>
        
        {/* THE CROP FEATURE */}
        <ReactCrop 
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            // onChange={(newCrop) => setCrop(newCrop)} 
            circularCrop
            keepSelection
            aspect={aspectRatio}
            minWidth={minDimension}
            className="h-72 w-64 my-14"
        >
            <img src={props.userProfileImage} alt="" onLoad={onImageLoadFunction} 
            ref={imageRef}
            className="h-72 w-64 border-2 border-blue-950 "
            crossOrigin="anonymous"
            />
        </ReactCrop>
        

        {/* BUTTONS WALA DIV */}
        <div className="flex justify-center items-center w-full gap-x-3">

          <button className="h-9 w-24 bg-black rounded-md text-sm font-semibold text-white transition-all ease-in delay-75 hover:bg-gray-800"
          onClick={ setNewImageToCanvas }
          >
            Save
          </button>

          <button
            className="h-9 w-24 bg-red-600 rounded-md text-sm font-semibold text-white transition-all ease-in delay-75 hover:bg-red-700"

            onClick={props.closeButtonFunction}
          >
            Close
          </button>

        </div>
        
        {
          crop && 
          <canvas 
          ref={canvasRef}
          className="hidden"
          />
        }

      </div>

    </>
  );
}

export default EditBox;


// ORIGINAL FUNCTION WRITTEN INSIDE THE ONCLICK OF SAVE BUTTON
// () => {
//   setCanvasPreview(
//     imageRef.current,
//     canvasRef.current,
//     convertToPixelCrop(
//       crop!,
//       imageRef.current!.width,
//       imageRef.current!.height
//     )
//   );

//   const newSetImage = canvasRef.current!.toDataURL();
//   if( newSetImage ){
//     setNewImage(newSetImage);
//   }
// }