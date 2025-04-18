'use server'

import { ID, Query } from "node-appwrite"
import { createAdimnClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"


const handelError=(error:any,message:string)=>{
    console.log(error,message);
    throw error;
}


const getUserByEmail=async(email:string)=>{
    const {databases}=await createAdimnClient()

    try {
         const result=await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.users,
        [Query.equal("email",email)]
    )

    return result.total > 0 ? result.documents[0] : null
    } 
    
    catch (error) 
    {
        handelError(error,'Something went wrong please try again later') 
        return null;   
    }
   
}

export const createAccount = async ({ fullName, email, password }: { fullName: string, email: string, password: string }) => {
    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { success: false, error: 'User already exists' };
        }

        const { account, databases } = await createAdimnClient();
        const user = await account.create(ID.unique(), email, password, fullName);

        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message || 'An error has occurred, please try again later' };
    }
};
