"use server";

import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";

export async function signInWithEmail(email: string, password: string) {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);
    
    (await cookies()).set("user_session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return {
      success: true,
      message: "Logged in successfully.",
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const { account } = await createAdminClient();

  try {
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("user_session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return {
      success: true,
      message: "Account created successfully.",
    };
  } catch (err) {
    const error = err as Error;
    return { 
      success: false,
      message: error.message, 
    };
  }
}

export async function signOut() {
  try {
    const { account } = await createSessionClient();
    
    (await cookies()).delete("user_session");
    await account.deleteSession("current");
    
    return {
      success: true,
      message: "Logged out successfully."
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}