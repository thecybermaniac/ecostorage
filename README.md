## EcoStorage

This is a Next.js application built for storing and retrieving all kinds of files. Live preview [here](https://ecostorage.vercel.app)

![EcoStorage](/public/assets/images/thumbnail.png)

## Features

-   [x] OTP authentication for greater file security
-   [x] File summary dashboard
-   [x] File uploads, including multiple files at once
-   [x] Support for all kinds of files
-   [x] File actions like "rename", "delete", "download", "share" and viewing details
-   [x] Owner privileges to prevent non-owners from making any changes
-   [x] Multiple files delete and download handling
-   [x] Global search
-   [x] Image previewer
-   [x] File sorting

## Usage

This application was built with [Appwrite](https://appwrite.io) and to make sure it works properly, you need to register and create a project on Appwrite to get the necessary keys:

```ini
# .env
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT=YOUR-APPWRITE-PROJECT-ID
NEXT_PUBLIC_APPWRITE_DATABASE=YOUR-APPWRITE-DATABASE-ID
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=YOUR-APPWRITE-USERS-COLLECTION-ID
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=YOUR-APPWRITE-FILES-COLLECTION-ID
NEXT_PUBLIC_APPWRITE_BUCKET=YOUR-APPWRITE-BUCKET-ID
NEXT_APPWRITE_KEY=YOUR-APPWRITE-API-KEY