import React, { ReactNode, useState } from 'react'
import ImageContext from './ImageContext'

function ImageContextProvider(children: any) {

    const [profileImage, setProfileImage] = useState<string>('');

  return (
    <ImageContext.Provider value={{profileImage, setProfileImage}}>
        {children}
    </ImageContext.Provider>
  )
}

export default ImageContextProvider
