import { Client, Databases, ID, Query, Storage } from 'appwrite';
import { v4 as uuidv4 } from 'uuid';

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
    async userDetails({usernameFrontend, bioFrontend, twitterFrontend, githubFrontend, instagramFrontend, behanceFrontend, linkedinFrontend, textFrontend, profilePhotoFrontend, fullNameFrontend, emailFrontend} : {usernameFrontend: string, bioFrontend: string, twitterFrontend: string, githubFrontend: string, instagramFrontend: string, behanceFrontend: string, linkedinFrontend: string, textFrontend: string, profilePhotoFrontend: string, fullNameFrontend: string, emailFrontend: string}){

        try {

            // const uniqueID = uuidv4();
            
            const createdDetails = await this.databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
                emailFrontend,
                {
                    'username' : usernameFrontend,
                    'bio' : bioFrontend ? bioFrontend : '',
                    'twitterURL' : twitterFrontend ? twitterFrontend : '',
                    'githubURL' : githubFrontend ? githubFrontend : '',
                    'instagramURL' : instagramFrontend ? instagramFrontend : '',
                    'behanceURL' : behanceFrontend ? behanceFrontend : '',
                    'linkedinURL' : linkedinFrontend ? linkedinFrontend : '',
                    'TextArea' : textFrontend ? textFrontend : '',
                    'profilePhoto' : profilePhotoFrontend ? profilePhotoFrontend : '',
                    'fullName' : fullNameFrontend,
                    'email': emailFrontend ? emailFrontend : '' 
                }
            )
            
            if( createdDetails ){
                return createdDetails;
            }
            // return null;

        } catch (error) {
            console.log("Error while adding details in the database:", error);
            
        }

    }

    // UPDATING THE USER DETAILS INTO THE DATABASE
    async updateUserDetails( {usernameFrontend, bioFrontend, twitterFrontend, githubFrontend, instagramFrontend, behanceFrontend, linkedinFrontend, textFrontend, profilePhotoFrontend, fullNameFrontend, emailFrontend} : {usernameFrontend: string, bioFrontend: string, twitterFrontend: string, githubFrontend: string, instagramFrontend: string, behanceFrontend: string, linkedinFrontend: string, textFrontend: string, profilePhotoFrontend: string, fullNameFrontend: string, emailFrontend: string}){

        try {
            
            const updatedDetails = await this.databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
                emailFrontend,
                {
                    'username' : usernameFrontend,
                    'bio' : bioFrontend ? bioFrontend : '',
                    'twitterURL' : twitterFrontend ? twitterFrontend : '',
                    'githubURL' : githubFrontend ? githubFrontend : '',
                    'instagramURL' : instagramFrontend ? instagramFrontend : '',
                    'behanceURL' : behanceFrontend ? behanceFrontend : '',
                    'linkedinURL' : linkedinFrontend ? linkedinFrontend : '',
                    'TextArea' : textFrontend ? textFrontend : '',
                    'profilePhoto' : profilePhotoFrontend ? profilePhotoFrontend : '',
                    'fullName' : fullNameFrontend,
                    'email' : emailFrontend ? emailFrontend : ''
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

    async getFilePreview( fileId: string ){

        try {
            
            const file = await this.storage.getFilePreview(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                fileId
            )

            if( file ){
                console.log("File found in the DB.");
                return file;
            }
            else{
                console.log("File not found!");
                return undefined;
            }

        } catch (error) {
            console.log( "Cannot fetch the file from the backend due to some issue: ", error );
        }

    }

    async getFile( fileId: string ){

        try {
            
            const file = await this.storage.getFile(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                fileId
            )

            if( file ){
                console.log("Found the file in the database");
                return file;
            }
            else{
                console.log("File not found in the database");
                return undefined;
            }

        } catch (error) {
            console.log("Error while getting the details of the file: ", error);
            
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

    async getAllDocuments( username: any ){

        try {
            
            const allDocs = await this.databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
                [ Query.equal("username", username) ]
            )

            if (allDocs.documents && allDocs.documents.length > 0) {
                return allDocs.documents[0]; 
            } else {
                return null; 
            }

        } catch (error) {
            console.log("Error while getting all documents: ", error);
            
        }

    }

    async getUser( userId:any ){

        try {
            
            const currentUser = await this.databases.getDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
                userId,
            )

            if( currentUser ){
                // console.log( "Details of the current user: ", currentUser );
                return currentUser;         
            }
            else{
                // console.log("Cannot get details of the user");
                return undefined;
            }

        } catch (error) {
            console.log("Error fetching the user details: ", error);
            
        }

    }

};

const databaseServiceObject = new DatabaseService();

export default databaseServiceObject;