"use client";

import { useState, useEffect } from 'react';

export type User = {
  $id: string;
  name: string;
  email: string;
};

// Client-side hook for fetching user data
export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch user data');
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        setError('An error occurred while fetching user data');
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { user, isLoading, error };
}

// Server-side function (can be imported in server components)
export async function fetchUserData(): Promise<User | null> {
  try {
    const response = await fetch('/api/user', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch user data');
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}