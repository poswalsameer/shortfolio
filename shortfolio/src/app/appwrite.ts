import { Client, Account, ID } from 'appwrite';
import { env } from 'process';

export class AuthService{

    client = new Client();
    account:any;

    constructor(){
        this.client
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
        this.account = new Account(this.client);
    }

    isValidEmail = (email:any) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // FUNCTION TO REGISTER USER
    async registerUser({ email, password, fullName}: { email: string, password: string, fullName:string ,username: string}){

        if (!this.isValidEmail(email)) {
            console.log("Invalid email address format.");
            return;
        }

        try {
            const createdUser = await this.account.create( ID.unique(), email, password, fullName);

            if( createdUser ){
                // redirect to login page and login the user
                // console.log("User created successfully");
                // return true;
                return this.loginUser({email, password});
            }
            else{
                return false;
                console.log("User cannot be created");
                
            }

        } catch (error) {
            console.log("Error while creating the user:", error);
            
        }

    }

    // FUNCTION TO LOGIN THE USER
    async loginUser( {email, password}: {email: string, password: string} ){

        try {
            const logInDetails = await this.account.createEmailPasswordSession(email, password);
            return logInDetails;
        } catch (error) {
            console.log("Error while logging the user in:", error);
        }

    }

    // FUNCTION TO CHECK IF LOGIN DONE OR NOT
    async getLoggedInUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Error finding the logged in user:", error);   
        }

        return null; // in case try catch fails by any how
    }

    // FUNCTION TO GET ANY CURRENT SESSION IF ANY
    async getCurrentSession(){
        try {
            
            const sessionDetails = await this.account.getSession('current');
            
            if( sessionDetails ){
                return sessionDetails;
            }
            else{
                console.log(" Could not find any sessions ");
                
            }

        } catch (error) {
            console.log("Error while getting the current session: ", error);
            
        }
    }

    // FUNCTION TO LOGOUT THE USER
    async logoutUser(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Error while logging out the user:", error);
            
        }
    }


}

const authServiceObject = new AuthService();

export default authServiceObject;


// function setProject(APPWRITE_PROJECT_ID: string | undefined) {
//     throw new Error('Function not implemented.');
// }

