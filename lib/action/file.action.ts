'use server'
import { createAdminClient } from "../appwrite"
import {InputFile} from "node-appwrite/file"
import { appwriteConfig } from "../appwrite/config";
import { ID, Query } from "node-appwrite";
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
//document | image | video | audio | other

interface getFilesProps{
    userId:string | undefined,
    email:string | undefined,
    type1:string | undefined,
    type2?:string | undefined
}

const createQueries=(userId:string,email:string,types:string[])=>{
    console.log(types)
    const queries = [
    Query.or([
      Query.equal("owners", [userId]),
      Query.contains("users", [email]),
    ]),
  ];
    if(types.length > 0) queries.push(Query.equal("type", types))

  return queries
}

export const getFiles=async({
    userId ,
    email,
    type1,
    type2
}:getFilesProps)=>{
    const {databases}=await createAdminClient()
    try {
        if(!userId) throw new Error("User not found")
        const types=[];
        types.push(type1!);
        if(type2) types.push(type2)

        const queries=createQueries(userId,email!,types)
        const files=await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.files,
            queries
        )

        return parseStringify(files)
        
        
    } catch (error) {
        handelError(error,'Failed to get the files')
    }
}



export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;

    const current = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.files,
      fileId
    );

    // Safely extract relationship field IDs
    const cleanedOwners = (current.owners ?? []).map((owner: any) =>
      typeof owner === 'string' ? owner : owner?.$id
    );
    const cleanedUsers = (current.users ?? []).map((user: any) =>
      typeof user === 'string' ? user : user?.$id
    );

    const updatePayload = {
      name: newName,
      // Include ALL required fields to avoid Appwrite validation errors
      type: current.type,
      accountId: current.accountId,
      bucketFileId: current.bucketFileId,
      url: current.url,
      owners: cleanedOwners,
      users: cleanedUsers,
    };

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.files,
      fileId,
      updatePayload
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handelError(error, "Failed to rename the file");
  }
};

export const updatedFile=async({fileId,emails,path}:UpdateFileUsersProps)=>{
  const {databases}=await createAdminClient()
  try {
    const updatedFile=await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.files,
      fileId,
      {
        users:emails
      }
    )

    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (error) {
      handelError(error,'Unable to share')
  }
}

export const deleteFile=async({fileId,bucketFileId,path}:DeleteFileProps)=>{
  const {databases,storage}=await createAdminClient()
  try {
    const deletedFile=await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.files,
      fileId,
    )
    if(deletedFile)
    {
      await storage.deleteFile(appwriteConfig.bucketId,bucketFileId)
    }

    revalidatePath(path)
    return parseStringify(deletedFile)
  } catch (error) {
      handelError(error,'Unable to share')
  }
}