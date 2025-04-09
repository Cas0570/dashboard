"use client";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import UserProfileWidget from "./UserProfileWidget";
import InitialAvatar from "../ui/avatar/InitialAvatar";
import { useUserData } from "@/lib/hooks/useUserData";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUserData();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Get first name
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown} 
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
        disabled={isLoading}
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <InitialAvatar name={user?.name || ""} size={44} />
          {/* <InitialAvatar name={user?.name || ""} imageUrl="/images/user/owner.jpg" size={44} /> */}
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {isLoading ? 'Loading...' : firstName || 'Guest'}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {user && <UserProfileWidget user={user} onClose={closeDropdown} />}
      </Dropdown>
    </div>
  );
}