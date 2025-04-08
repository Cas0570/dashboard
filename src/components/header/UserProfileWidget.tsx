"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/server/auth-actions";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

type User = {
  $id: string;
  name: string;
  email: string;
};

interface UserProfileWidgetProps {
  user: User;
  onClose: () => void;
}

export default function UserProfileWidget({ user, onClose }: UserProfileWidgetProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const result = await signOut();
      if (result.success) {
        router.push("/admin/signin");
      } else {
        console.error("Failed to sign out:", result.message);
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <>
      <div>
        <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {user.name}
        </span>
        <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {user.email}
        </span>
      </div>

      <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li>
          <DropdownItem
            onItemClick={onClose}
            tag="a"
            href="/admin/profile"
            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <svg
              className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                fill=""
              />
            </svg>
            Edit profile
          </DropdownItem>
        </li>
        <li>
          <DropdownItem
            onItemClick={onClose}
            tag="a"
            href="https://cloud.appwrite.io/console/project-67efe659000a3f5b3ac5/overview/platforms"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <svg 
              className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg" 
            >
              <g transform="translate(0.5, 0.5)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M23 15.8V20.6H10.5C6.8 20.6 3.6 18.6 1.9 15.6C1.6 15.1 1.4 14.7 1.2 14.2C0.8 13.3 0.6 12.2 0.5 11.2V9.8C0.5 9.6 0.5 9.3 0.6 9.1C0.6 8.6 0.7 8.1 0.9 7.7C2 3.5 5.9 0.5 10.5 0.5C15.1 0.5 19 3.5 20.1 7.7H14.9C14 6.2 12.3 5.3 10.5 5.3C8.7 5.3 7 6.2 6.1 7.7C5.8 8.1 5.6 8.6 5.4 9.1C5.3 9.6 5.2 10.1 5.2 10.5C5.2 12 5.9 13.4 6.9 14.4C7.8 15.3 9.1 15.8 10.5 15.8H23Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <path
                  d="M23 9.1V14.4H14.1C15.1 13.4 15.8 12 15.8 10.5C15.8 10.1 15.7 9.6 15.6 9.1H23Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            </svg>
            Appwrite Console
          </DropdownItem>
        </li>
        <li>
          <DropdownItem
            onItemClick={onClose}
            tag="a"
            href="#"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <svg
              className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5 19.75C19.5 20.9926 18.4926 22 17.25 22H6.75C5.50736 22 4.5 20.9926 4.5 19.75V9.62105C4.5 9.02455 4.73686 8.45247 5.15851 8.03055L10.5262 2.65951C10.9482 2.23725 11.5207 2 12.1177 2H17.25C18.4926 2 19.5 3.00736 19.5 4.25V19.75ZM17.25 20.5C17.6642 20.5 18 20.1642 18 19.75V4.25C18 3.83579 17.6642 3.5 17.25 3.5H12.248L12.2509 7.49913C12.2518 8.7424 11.2442 9.75073 10.0009 9.75073H6V19.75C6 20.1642 6.33579 20.5 6.75 20.5H17.25ZM7.05913 8.25073L10.7488 4.55876L10.7509 7.5002C10.7512 7.91462 10.4153 8.25073 10.0009 8.25073H7.05913ZM8.25 14.5C8.25 14.0858 8.58579 13.75 9 13.75H15C15.4142 13.75 15.75 14.0858 15.75 14.5C15.75 14.9142 15.4142 15.25 15 15.25H9C8.58579 15.25 8.25 14.9142 8.25 14.5ZM8.25 17.5C8.25 17.0858 8.58579 16.75 9 16.75H12C12.4142 16.75 12.75 17.0858 12.75 17.5C12.75 17.9142 12.4142 18.25 12 18.25H9C8.58579 18.25 8.25 17.9142 8.25 17.5Z"
                fill=""
              />
            </svg>
            Documentation
          </DropdownItem>
        </li>
      </ul>
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <svg
          className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
            fill=""
          />
        </svg>
        {isLoading ? "Signing out..." : "Sign out"}
      </button>
    </>
  );
}