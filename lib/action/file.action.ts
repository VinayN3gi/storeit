'use server'
import { createAdminClient, createSessionClient } from "../appwrite"
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
    type1?:string | undefined,
    type2?:string | undefined,
    searchText:string,
    sortText:string | undefined,
    limit?:number
}

const createQueries=(userId:string,email:string,types:string[],searchText:string,sortText:string,limit?:number)=>{
    const queries = [
    Query.or([
      Query.equal("owners", [userId]),
      Query.contains("users", [email]),
    ]),
  ];
    if(types.length > 0) queries.push(Query.equal("type", types))

    if(searchText!=" ") queries.push(Query.contains("name", searchText))

    if(limit) queries.push(Query.limit(limit))

    if(sortText.includes("-"))
    {
      const [sortBy,orderBy]=sortText.split("-");
      queries.push(orderBy=="asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy))
    }

   

  return queries
}

export const getFiles=async({
    userId ,
    email,
    type1,
    type2,
    searchText,
    sortText="$createdAt-desc",
    limit
}:getFilesProps)=>{
    const {databases}=await createAdminClient()
    console.log(`The search and sort text are ${searchText} and ${sortText}`)
    try {
        if(!userId) throw new Error("User not found")
        if(!email) throw new Error("Email not found")
        const types=[];
        if(type1) types.push(type1);
        if(type2) types.push(type2)

        const queries=createQueries(userId, email, types, searchText, sortText, limit)
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

export async function getTotalSpaceUsed({userId,email}:{userId:string,email:string}) {
  try {
    const { databases } = await createSessionClient();
    
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.files,
      [Query.equal("owner", [userId])],
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handelError(error, "Error calculating total space used:, ");
  }
}