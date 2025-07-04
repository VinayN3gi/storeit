export const appwriteConfig={
    endpointUrl:process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId:process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId:process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    users:process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
    files:process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
    bucketId:process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
    secretKey:process.env.NEXT_APPWRITE_KEY!,
    jwt:process.env.NEXT_APPWRITE_JWT!
}