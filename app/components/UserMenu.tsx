"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
      setIsOpen(false);
    } catch (error) {
      console.error("登出失敗:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="用戶頭像"
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <FontAwesomeIcon
            icon={faUserCircle}
            size="2x"
            className="text-gray-500"
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user.displayName}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}
