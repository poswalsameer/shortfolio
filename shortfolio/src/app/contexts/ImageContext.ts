import { createContext } from "react";

interface ImageContextType {
    profileImage: string;
    setProfileImage: React.Dispatch<React.SetStateAction<string>>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export default ImageContext;