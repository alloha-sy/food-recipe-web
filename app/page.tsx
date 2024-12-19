"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./contexts/AuthContext";
import Logo from "./components/Logo";
import UserMenu from "./components/UserMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faComments,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white">
      {/* Hero 區域 */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-display text-gray-900 mb-6">
              分享美食，
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
                連結美好時光
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              加入我們的美食社群，探索無限美味可能，與同好分享烹飪樂趣
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/recipes"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-md"
              >
                探索食譜
              </Link>
              <Link
                href="/chat"
                className="bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md border border-gray-200"
              >
                加入討論
              </Link>
              <Link
                href="/recipes/new"
                className="bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md border border-gray-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                分享食譜
              </Link>
            </div>
          </div>
        </div>

        {/* 特色區塊 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">
                分享食譜
              </h3>
              <p className="text-gray-600">
                輕鬆分享您的獨家食譜，記錄烹飪過程，展示美味成果
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon
                  icon={faComments}
                  className="w-6 h-6 text-pink-600"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">即時交流</h3>
              <p className="text-gray-600 mb-4">
                加入美食聊天室，與同好即時分享烹飪心得與美食體驗
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
              >
                <span>進入聊天室</span>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="w-4 h-4 ml-1"
                />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">探索靈感</h3>
              <p className="text-gray-600">
                發掘新的烹飪靈感，學習不同料理技巧，豐富美食生活
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
