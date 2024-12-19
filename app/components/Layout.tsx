"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import { isNoLayoutRoute } from "../utils/routeUtils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 檢查當前路徑是否需要 Layout
  if (isNoLayoutRoute(pathname)) {
    return <>{children}</>;
  }

  // 在客戶端渲染之前不顯示用戶相關的 UI
  if (!mounted) {
    return (
      <div className="bg-gradient-to-b from-orange-100 ">
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Logo />
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-1">
                <Link
                  href="/recipes"
                  className="px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all font-medium text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  探索食譜
                </Link>
                <Link
                  href="/chat"
                  className="px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all font-medium text-sm flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  聊天室
                </Link>
              </div>

              <div className="flex items-center">
                {user ? (
                  <UserMenu />
                ) : (
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-pink-600 transition-colors"
                  >
                    登入
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
