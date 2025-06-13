# DropIt Website
Authenticate using Appwrite to access your drive.Upload files via drag-and-drop or file picker.Create folders and organize your files.Click on files to preview them directly in the browser. A companion mobile application built with React Native + Expo is also available. Both web and mobile apps are seamlessly integrated via Appwrite.



## <a name="table">Table of Contents</a>

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Installation](#installation)
5. [Usage](#usage)

## Introduction
This platform allows users to upload, manage, and preview files securely in a cloud-based environment, similar to Google Drive. Built with scalability and modern best practices in mind, it leverages Appwrite for backend services and a fully type-safe frontend powered by Next.js 15 with the App Router.
.

## <a name="tech-stack">Tech Stack</a>


- Next.js 15: A powerful full-stack React framework with App Router and server components support
- TypeScript: A statically typed language for safer and more maintainable JavaScript
- Tailwind CSS: A utility-first CSS framework for building modern responsive UIs
- Appwrite: A backend-as-a-service for authentication, file storage, and database management


## <a name="features">Features</a>


- Clean and Responsive UI
- Secure Authentication using Appwrite
- File Upload & Cloud Storage
- Folder Management & Navigation
- File Previews (images, PDFs, etc.)
- Drag-and-Drop Upload Support
- Persistent Sessions
- Mobile App Integration with Shared Auth and Data Layer

## <a name="installation">Installation</a>

To run the project locally, follow these steps:

### Prerequisites

- Node.js
- Git
- pnpm or npm

### Installation

1. Clone the repository:

   ```bash
   https://github.com/VinayN3gi/storeit.git
   cd storeit
2. Install depenpendencies:
    ```bash
    npm install
3. Create a .env file at the root of the project and add the following
   ```env
    NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
    NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
    NEXT_PUBLIC_APPWRITE_DATABASE=your_database_id
    NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=your_user_database_id
    NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=your_files_database_id
    NEXT_PUBLIC_APPWRITE_BUCKET=your_bucket_Id
    NEXT_APPWRITE_KEY=your_secret_api_key
5. Start the development server
    ```bash
    npm run dev
The app will be available at http://localhost:3000


## <a name="usage">Usage</a>

- Authenticate using Appwrite to access your drive.

- Upload files via drag-and-drop or file picker.

- Create folders and organize your files.

- Click on files to preview them directly in the browser.



