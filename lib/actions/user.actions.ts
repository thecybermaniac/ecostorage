"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  // check if user exists
  const existingUser = await getUserByEmail(email);

  // get the accountId by sending OTP
  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  // if there is no existing user, create a new user
  if (!existingUser) {
    const { databases, avatars, storage } = await createAdminClient();

    // Generate avatar using initials
    const avatarBuffer = await avatars.getInitials(fullName);

    // Convert ArrayBuffer to File
    const avatarFile = new File([avatarBuffer], `${fullName}-avatar.png`, {
      type: "image/png",
      lastModified: Date.now(),
    });

    // Upload the avatar to Appwrite storage
    const avatarUploadResponse = await storage.createFile(
      appwriteConfig.bucketId, // Bucket ID
      ID.unique(), // Unique file ID
      avatarFile // Avatar file object
    );

    console.log("avatar upload", avatarUploadResponse);

    // Get the file URL
    const avatarUrl = `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${avatarUploadResponse.$id}/view?project=${appwriteConfig.projectId}&project=${appwriteConfig.projectId}&mode=admin`;

    console.log("avatar url", avatarUrl);

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarUrl,
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};

export const verifyOTP = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { databases, account } = sessionClient;

  const result = await account.get();

  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("accountId", result.$id)]
  );

  if (user.total <= 0) return null;

  return parseStringify(user.documents[0]);
};

export const signOutUser = async () => {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    return null;
  }

  const { account } = sessionClient;

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Error logging out");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    // user exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Couldn't log in, please try again later.");
  }
};
