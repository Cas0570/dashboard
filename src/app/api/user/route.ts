import { getLoggedInUser } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    
    // Return only what we need, don't expose sensitive data
    return NextResponse.json({
      $id: user.$id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}