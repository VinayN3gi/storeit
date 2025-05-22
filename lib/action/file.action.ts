'use server'
import { createAdminClient } from "../appwrite"
import {InputFile} from "node-appwrite/file"
import { appwriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, convertFileToUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";


// Error handling helper
const handelError = (error: any, message: string) => {
    console.log(error, message);
    throw error;
};

export const uploadFile=async({
    file,
    ownerId,
    accountId,
    path
}:UploadFileProps)=>{
    const {storage,databases}=await createAdminClient()
   


    try {
        const inputFile=InputFile.fromBuffer(file,file.name)
        console.log(appwriteConfig.bucketId)

        //For the file storage
        const bucketFile=await storage.createFile(appwriteConfig.bucketId,ID.unique(),inputFile)

        //For the metadata store using database
        const fileDocument={
            type:getFileType(bucketFile.name).type,
            name:bucketFile.name,
            url:constructFileUrl(bucketFile.$id),
            extension:getFileType(bucketFile.name).extension,
            size:bucketFile.sizeOriginal,
            owners:ownerId,
            accountId,
            users:[],
            bucketFileId:bucketFile.$id
        }

        //If metadata is not stored then delete file as well
        const newFile=await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.files,
            ID.unique(),
            fileDocument,
        ).catch(async (error:unknown)=>{
            await storage.deleteFile(
                appwriteConfig.bucketId,
                bucketFile.$id
            );
            handelError(error,"Failed to create file document")
        })


        revalidatePath(path)

        //Returning the metadata
        return parseStringify(newFile)


    } catch (error) {
        handelError(error,"Failed to upload file")
    }
    
}