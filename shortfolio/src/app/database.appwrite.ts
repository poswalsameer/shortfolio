import { Client, Databases, ID, Storage } from 'appwrite';

export class DatabaseService{

    client = new Client();
    databases:any;
    storage:any;

    constructor(){

        this.client
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
        
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);

    }

    // FEEDING THE USER DETAILS INTO THE DATABASE
    async userDetails({usernameFrontend, bioFrontend, twitterFrontend, githubFrontend, instagramFrontend, behanceFrontend, linkedinFrontend, textFrontend, profilePhotoFrontend} : {usernameFrontend: string, bioFrontend: string, twitterFrontend: string, githubFrontend: string, instagramFrontend: string, behanceFrontend: string, linkedinFrontend: string, textFrontend: string, profilePhotoFrontend: string}){

        try {
            
            const createdDetails = await this.databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
                ID.unique(),
                {
                    'username' : usernameFrontend,
                    'bio' : bioFrontend,
                    'twitterURL' : twitterFrontend ? twitterFrontend : '',
                    'githubURL' : githubFrontend ? githubFrontend : '',
                    'instagramURL' : instagramFrontend ? instagramFrontend : '',
                    'behanceURL' : behanceFrontend ? behanceFrontend : '',
                    'linkedinURL' : linkedinFrontend ? linkedinFrontend : '',
                    'TextArea' : textFrontend ? textFrontend : '',
                    'profilePhoto' : profilePhotoFrontend
                }
            )
            
            if( createdDetails ){
                return createdDetails;
            }
            return null;

        } catch (error) {
            console.log("Error while adding details in the database:", error);
            
        }

    }

    // UPDATING THE USER DETAILS INTO THE DATABASE
    async updateUserDetails({usernameFrontend, bioFrontend, twitterFrontend, githubFrontend, instagramFrontend, behanceFrontend, linkedinFrontend, textFrontend, profilePhotoFrontend} : {usernameFrontend: string, bioFrontend: string, twitterFrontend: string, githubFrontend: string, instagramFrontend: string, behanceFrontend: string, linkedinFrontend: string, textFrontend: string, profilePhotoFrontend: string}){

        try {
            
            const updatedDetails = await this.databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
                ID.unique(),
                {
                    'username' : usernameFrontend,
                    'bio' : bioFrontend,
                    'twitterURL' : twitterFrontend ? twitterFrontend : '',
                    'githubURL' : githubFrontend ? githubFrontend : '',
                    'instagramURL' : instagramFrontend ? instagramFrontend : '',
                    'behanceURL' : behanceFrontend ? behanceFrontend : '',
                    'linkedinURL' : linkedinFrontend ? linkedinFrontend : '',
                    'TextArea' : textFrontend ? textFrontend : '',
                    'profilePhoto' : profilePhotoFrontend
                },
                // ["read("any")"]
            )
            
            if( updatedDetails ){
                return updatedDetails;
            }
            return null;

        } catch (error) {
            console.log("Error while updating details in the database:", error);
            
        }


    }

    // UPLOADING ANY FILE IN STORAGE
    async fileUpload(file:any){

        try {
            
            const uploadedFile = await this.storage.createFile(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                file
            )

            if( uploadedFile ){
                return uploadedFile;
            }
            return null;

        } catch (error) {
            console.log("Error while uploading the file: ", error );
            
        }

    }

    // DELETING FILE FROM STORAGE
    async deleteFile(fileId:any){
        try {
            
            const deletedFile = await this.storage.deleteFile(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                fileId
            )

            return deletedFile;

        } catch (error) {
            console.log("Error while deleting the file:", error);
            
        }
    }

    // FUNCTION TO UPDATE THE FILE IN STORAGE
    async updateFile( fileId:any ){

        try {
            
            const updatedFile = await this.storage.updateFile(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                fileId
            )

            return updatedFile;

        } catch (error) {
            console.log("Error while updating the file:", error);
            
        }

    }

};

const databaseServiceObject = new DatabaseService();

export default databaseServiceObject;