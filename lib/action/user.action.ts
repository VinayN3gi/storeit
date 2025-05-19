'use server'
// userActions.ts
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { cookies } from "next/headers";

// Error handling helper
const handelError = (error: any, message: string) => {
    console.log(error, message);
    throw error;
};

// Get user by email from the database
const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient(); // Admin Client is used here

    try {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.users,
            [Query.equal("email", email)]
        );

        return result.total > 0 ? result.documents[0] : null;
    } catch (error) {
        handelError(error, "Something went wrong please try again later");
        return null;
    }
};

// Create a new account
export const createAccount = async ({
    fullName,
    email,
    password
}: {
    fullName: string;
    email: string;
    password: string;
}) => {
    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { success: false, error: "User already exists" };
        }

        const { account, databases } = await createAdminClient(); // Admin Client is used here
        const user = await account.create(ID.unique(), email, password, fullName);
       const session = await account.createEmailPasswordSession(email, password);

      (await cookies()).set("my-custom-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        });



        const createDoc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.users,
            ID.unique(),
            {
                fullName,
                email,
                accountId: ID.unique()
            }
        );

        if (!createDoc) {
            throw new Error("Failed to create user document");
        }

        return { success: true, user };
    } catch (error: any) {
        handelError(error, "Failed to sign in user");
        return { success: false, error: error.message };
    }
};

// User sign-in and JWT creation
export const signIn = async ({
    email,
    password
}: {
    email: string;
    password: string;
}) => {
    try {
        const { account } = await createAdminClient(); // Create session client first (JWT will be fetched from cookies here)
    
        const session = await account.createEmailPasswordSession(email, password);
        return {
            success: true,
            session
        };
    } catch (error: any) {
        handelError(error, "Error signing in user");
        return {
            success: false,
            error: error.message
        };
    }
};

// Get current user information
export const getCurrentUser = async () => {
    try {
        const { databases, account } = await createSessionClient(); // Session Client used here
        const result = await account.get();

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.users,
            [Query.equal("accountId", result.$id)]
        );

        if (user.total <= 0) return null;

        return user.documents[0];
    } catch (error) {
        handelError(error, "User was not fetched");
        return null;
    }
};

export const logout = async () => {
    try {
        const { account } = await createSessionClient();
        //(await cookies()).delete("my-custom-session");
        await account.deleteSession("current");
        return { success: true };
    } catch (error: any) {
        console.error("Error logging out:", error);
        return { success: false, error: error.message };
    }
};

export const getLoggedInUser=async ()=>
{
    try {
        const {account}=await createSessionClient();
        return await account.get()
    } catch (error) {
        return null;
    }
}

