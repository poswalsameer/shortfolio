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
      absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[60%] w-[70%] flex flex-col justify-center items-center text-black rounded-xl border-2 border-blue-950
      sm:absolute sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:h-[70%] sm:w-[50%] sm:flex sm:flex-col sm:justify-center sm:items-center sm:text-black sm:rounded-xl sm:border-2 sm:border-blue-950
      md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:h-[80%] md:w-[45%] md:flex md:flex-col md:justify-center md:items-center md:text-black md:rounded-2xl md:border-2 md:border-blue-950
      lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 lg:h-[90%] lg:w-[40%] lg:flex lg:flex-col lg:justify-center lg:items-center lg:text-black lg:rounded-2xl lg:border-2 lg:border-blue-950
      xl:absolute xl:top-1/2 xl:left-1/2 xl:transform xl:-translate-x-1/2 xl:-translate-y-1/2 xl:h-[90%] xl:w-[35%] xl:flex xl:flex-col xl:justify-center xl:items-center xl:text-black xl:rounded-2xl xl:border-2 xl:border-blue-950
      2xl:absolute 2xl:top-1/2 2xl:left-1/2 2xl:transform 2xl:-translate-x-1/2 2xl:-translate-y-1/2 2xl:h-[90%] 2xl:w-[35%] 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:text-black 2xl:rounded-2xl 2xl:border-2 2xl:border-blue-950" id="editBoxDiv">

        <div className="
        flex justify-center items-center font-semibold text-2xl
        sm:flex sm:justify-center sm:items-center sm:font-semibold sm:text-2xl
        md:flex md:justify-center md:items-center md:font-semibold md:text-2xl
        lg:flex lg:justify-center lg:items-center lg:font-semibold lg:text-2xl
        xl:flex xl:justify-center xl:items-center xl:font-semibold xl:text-2xl
        2xl:flex 2xl:justify-center 2xl:items-center 2xl:font-semibold 2xl:text-2xl">
          EDIT IMAGE
        </div>
        
        {/* THE CROP FEATURE */}
        <ReactCrop 
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            // onChange={(newCrop) => setCrop(newCrop)} 
            circularCrop
            keepSelection
            aspect={aspectRatio}
            minWidth={minDimension}
            className="
            h-44 w-36 my-12
            sm:h-56 sm:w-48 sm:my-12
            md:h-64 md:w-56 md:my-14
            lg:h-72 lg:w-64 lg:my-14
            xl:h-72 xl:w-64 xl:my-14
            2xl:h-72 2xl:w-64 2xl:my-14"
        >
            <img src={props.userProfileImage} alt="" onLoad={onImageLoadFunction} 
            ref={imageRef}
            className="
            h-44 w-36 border-2 border-blue-950
            sm:h-56 sm:w-48 sm:border-2 sm:border-blue-950
            md:h-64 md:w-56 md:border-2 md:border-blue-950
            lg:h-72 lg:w-64 lg:border-2 lg:border-blue-950
            xl:h-72 xl:w-64 xl:border-2 xl:border-blue-950 
            2xl:h-72 2xl:w-64 2xl:border-2 2xl:border-blue-950 "
            crossOrigin="anonymous"
            />
        </ReactCrop>
        

        {/* BUTTONS WALA DIV */}
        <div className="
        flex justify-center items-center w-full gap-x-3
        sm:flex sm:justify-center sm:items-center sm:w-full sm:gap-x-3
        md:flex md:justify-center md:items-center md:w-full md:gap-x-3
        lg:flex lg:justify-center lg:items-center lg:w-full lg:gap-x-3
        xl:flex xl:justify-center xl:items-center xl:w-full xl:gap-x-3
        2xl:flex 2xl:justify-center 2xl:items-center 2xl:w-full 2xl:gap-x-3">

          <button className="
          h-8 w-20 bg-black rounded-md text-sm font-semibold text-white 
          sm:h-8 sm:w-20 sm:bg-black sm:rounded-md sm:text-sm sm:font-semibold sm:text-white 
          md:h-9 md:w-24 md:bg-black md:rounded-md md:text-sm md:font-semibold md:text-white 
          lg:h-9 lg:w-24 lg:bg-black lg:rounded-md lg:text-sm lg:font-semibold lg:text-white 
          xl:h-9 xl:w-24 xl:bg-black xl:rounded-md xl:text-sm xl:font-semibold xl:text-white 
          2xl:h-9 2xl:w-24 2xl:bg-black 2xl:rounded-md 2xl:text-sm 2xl:font-semibold 2xl:text-white 
          transition-all ease-in delay-75 hover:bg-gray-800"
          onClick={ setNewImageToCanvas }
          >
            Save
          </button>

          <button
            className="
            h-8 w-20 bg-red-600 rounded-md text-sm font-semibold text-white
            sm:h-8 sm:w-20 sm:bg-red-600 sm:rounded-md sm:text-sm sm:font-semibold sm:text-white
            md:h-9 md:w-24 md:bg-red-600 md:rounded-md md:text-sm md:font-semibold md:text-white
            lg:h-9 lg:w-24 lg:bg-red-600 lg:rounded-md lg:text-sm lg:font-semibold lg:text-white
            xl:h-9 xl:w-24 xl:bg-red-600 xl:rounded-md xl:text-sm xl:font-semibold xl:text-white
            2xl:h-9 2xl:w-24 2xl:bg-red-600 2xl:rounded-md 2xl:text-sm 2xl:font-semibold 2xl:text-white 
            transition-all ease-in delay-75 hover:bg-red-700"

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